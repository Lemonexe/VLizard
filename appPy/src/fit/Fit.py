import os
import numpy as np
from matplotlib import pyplot as plt
from scipy.optimize import least_squares
from src.TD.VLE_models.van_Laar import van_Laar_model
from src.TD.VLE_models.NRTL import NRTL_model
from src.TD.VLE import VLE
from src.utils.Result import Result
from src.utils.errors import AppException
from src.utils.vector import pick_vector, overlay_vectors
from src.utils.datasets import parse_datasets
from src.utils.io.echo import echo, underline_echo
from src.utils.systems import get_system_path
from src.utils.io.json import open_json, save_json
from .Tabulate import Tabulate

default_model = 'vanLaar'
supported_models = {'vanLaar': van_Laar_model, 'NRTL': NRTL_model}

# squash a selected VLE property from list of VLEs into a single array
squash = lambda vles, prop: np.concatenate([getattr(vle, prop) for vle in vles])


# create non-linear regression problem for given binary system datasets and selected model
# optionally with list of initial params (or None), and/or indices which parameters to keep constant (or None)
class Fit(Result):

    def __init__(self, compound1, compound2, model_id, datasets, params, consts_idxs):
        super().__init__()
        self.compound1 = compound1
        self.compound2 = compound2

        self.dataset_names = parse_datasets(compound1, compound2, datasets)

        if not model_id in supported_models:
            raise AppException(f'Unknown model {model_id}.\nAvailable models: {", ".join(supported_models.keys())}')
        self.model = model = supported_models[model_id]

        if not model.is_gamma_T_fun and len(self.dataset_names) > 1:
            msg = f'{model.display_name} model is T independent, fitting of multiple datasets of different pressure is not recommended'
            self.warn(msg)

        common_msg = f'{model.display_name} model expects {model.n_params} parameters'
        if params and len(params) != model.n_params:
            raise AppException(f'{common_msg}, got {len(params)}')
        if consts_idxs and len(consts_idxs) > model.n_params:
            raise AppException(f'{common_msg}, can\'t set {len(consts_idxs)} as constant')

        self.consts_idxs = consts_idxs or []  # indices of parameters to keep constant
        self.params0 = params or model.params0  # use either given params or default model params as initial estimate
        self.result_params = None  # result of optimization
        self.sumsq_resid_final = None
        self.sumsq_resid_init = None

        self.tabulated_datasets = None  # T, x_1, y_1, gamma_1, gamma_2 tabulation of fitted model for each dataset

        self.dataset_VLEs = [VLE(compound1, compound2, dataset_name) for dataset_name in self.dataset_names]

        self.x_1 = squash(self.dataset_VLEs, 'x_1')
        self.y_1 = squash(self.dataset_VLEs, 'y_1')
        self.T = squash(self.dataset_VLEs, 'T')
        self.gamma_1 = squash(self.dataset_VLEs, 'gamma_1')
        self.gamma_2 = squash(self.dataset_VLEs, 'gamma_2')

        self.optimize()

    def optimize(self):
        gamma_M = np.vstack([self.gamma_1, self.gamma_2])  # serialize both dependent variables

        # sort model parameters per indices: those that are to be kept constant, those that will be optimized
        consts, picked_params0 = pick_vector(self.params0, self.consts_idxs)

        # vector of residuals for least_squares as function of all model parameters
        residual = lambda params: (self.model.fun(self.x_1, self.T, *params) - gamma_M).flatten()

        # wrapped residual as function of picked model parameters, which are merged with the const model parameters
        callback = lambda picked_params: residual(overlay_vectors(consts, self.consts_idxs, picked_params))

        # optimization itself, using built-in Levenberg-Marquardt algorithm
        result = least_squares(callback, picked_params0, method='lm')
        if result.status <= 0: raise AppException(f'Optimization failed with status {result.status}: {result.message}')
        self.result_params = overlay_vectors(consts, self.consts_idxs, result.x)

        self.sumsq_resid_init = np.sum(np.square(residual(self.params0)))
        self.sumsq_resid_final = np.sum(np.square(result.fun))

    def tabulate(self):
        self.tabulated_datasets = [Tabulate(vle, self.model, self.result_params) for vle in self.dataset_VLEs]

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        echo('Optimization complete with following parameters:')
        for (name, value) in zip(self.model.param_names, self.result_params):
            echo(f'  {name} = {value:.4g}')

        echo('')
        echo(f'Initial residual   = {self.sumsq_resid_init:.3g}')
        echo(f'Remaining residual = {self.sumsq_resid_final:.3g}')

    def get_title(self):
        return f'Regression of {self.model.display_name} on {self.compound1}-{self.compound2} ({", ".join(self.dataset_names)})'

    def plot_xy_model(self):
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            vle.plot_xy(silent=True)
            plt.plot(tab.x_1, tab.y_1, '-k', label=self.model.display_name)
            plt.legend()
            plt.ion()
            plt.show()

    def plot_Txy_model(self):
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            vle.plot_Txy(silent=True)
            plt.plot(tab.y_1, tab.T, '-r', label=f'dew {self.model.display_name}')
            plt.plot(tab.x_1, tab.T, '-b', label=f'boil {self.model.display_name}')
            plt.legend()
            plt.ion()
            plt.show()

    def plot_gamma_model(self):
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            vle.plot_gamma(silent=True)
            plt.plot(tab.x_1, tab.gamma_1, '-r', label=f'$\\gamma_1$ {self.model.display_name}')
            plt.plot(tab.x_1, tab.gamma_2, '-b', label=f'$\\gamma_2$ {self.model.display_name}')
            plt.legend()
            plt.ion()
            plt.show()

    # unused code for saving/loading results
    # it is not viable for CLI, but will be used for UI, albeit it'll probably need to be refactored a bit
    def get_json_path(self):
        system_dir_path = get_system_path(self.compound1, self.compound2)
        return os.path.join(system_dir_path, 'analysis', f'{self.model.display_name}.json')

    def load(self):
        json_path = self.get_json_path()
        on_error = lambda exc: self.warn(f'Ignored saved results in {json_path} because file is not a valid json')
        saved_results = open_json(json_path, on_error=on_error)
        if not saved_results: return
        self.params0 = saved_results['params']
        self.consts_idxs = saved_results['consts_idxs']

    def save(self):
        json_path = self.get_json_path()
        saved_results = {
            'dataset_names': self.dataset_names,
            'params': list(self.result_params),
            'consts_idxs': list(self.consts_idxs),
            'residual': self.sumsq_resid_final
        }
        save_json(saved_results, json_path)