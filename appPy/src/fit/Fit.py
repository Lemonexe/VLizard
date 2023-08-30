import numpy as np
from matplotlib import pyplot as plt
from scipy.optimize import least_squares
from src.TD.VLE_models.NRTL import NRTL_model, NRTL10_model
from src.TD.VLE_models.van_Laar import van_Laar_model
from src.TD.VLE_models.margules import margules_model
from src.TD.VLE import VLE
from src.utils.Result import Result
from src.utils.errors import AppException
from src.utils.vector import pick_vector, overlay_vectors
from src.utils.datasets import parse_datasets
from src.utils.io.echo import echo, underline_echo
from .VLE_Tabulation import VLE_Tabulation

default_model = NRTL_model.name
supported_models = [NRTL_model, NRTL10_model, van_Laar_model, margules_model]
supported_model_names = [model.name for model in supported_models]

# squash a selected VLE property from list of VLEs into a single array
squash = lambda vle_list, prop: np.concatenate([getattr(vle, prop) for vle in vle_list])


class Fit(Result):

    def __init__(self, compound1, compound2, model_name, datasets, params0, const_param_names):
        """
        Create non-linear regression problem for given binary system VLE datasets and a selected model.

        compound1 (str): name of first compound of the system.
        compound2 (str): name of second compound of the system.
        model_name (str): name of the model to be fitted.
        datasets (list of str): names of datasets to be fitted.
        params0 (list of float): initial estimate of model parameters (ordered).
        const_param_names (list of str): names of parameters to be kept constant during optimization.
        """
        super().__init__()
        self.keys_to_serialize = ['is_optimized', 'result_params', 'resid_final', 'resid_init', 'tabulated_datasets']
        self.compound1 = compound1
        self.compound2 = compound2
        self.dataset_names = parse_datasets(compound1, compound2, datasets)
        self.model = self.__parse_model(model_name)
        self.params0 = self.__parse_params0(params0)  # initial params
        self.const_param_names = self.__parse_const_param_names(const_param_names)  # param names to be kept constant
        self.result_params = self.params0  # result of optimization
        self.tabulated_datasets = None  # T, x_1, y_1, y_2 gamma_1, gamma_2 tabulation of fitted model for each dataset
        self.is_optimized = False  # whether optimization has been performed

        self.dataset_VLEs = [VLE(compound1, compound2, dataset_name) for dataset_name in self.dataset_names]

        # serialize all datasets to one array per property
        self.x_1 = squash(self.dataset_VLEs, 'x_1')
        self.T = squash(self.dataset_VLEs, 'T')
        self.gamma_1 = squash(self.dataset_VLEs, 'gamma_1')
        self.gamma_2 = squash(self.dataset_VLEs, 'gamma_2')

        # initial and final objective function values
        self.resid_init = np.sum(np.square(self.get_residual(self.params0)))
        self.resid_final = None

    def __parse_model(self, model_name):
        """Parse model_name and check if it is appropriate for given datasets."""
        supported_model_names_lcase = [name.lower() for name in supported_model_names]
        if not model_name.lower() in supported_model_names_lcase:
            csv = ', '.join(supported_model_names)
            raise AppException(f'Unknown model {model_name}.\nAvailable models: {csv}')

        model = supported_models[supported_model_names_lcase.index(model_name.lower())]

        if not model.is_gamma_T_fun and len(self.dataset_names) > 1:
            msg = f'{model.display_name} model is T independent, fitting of multiple datasets of different pressure is not recommended'
            self.warn(msg)
        return model

    def __parse_params0(self, params0):
        """Parse & validate params0, use either given params or default model params as initial estimate."""
        model = self.model
        if not params0: return model.params0
        if len(params0) != model.n_params:
            raise AppException(f'{model.display_name} model expects {model.n_params} parameters, got {len(params0)}!')
        return params0

    def __parse_const_param_names(self, const_param_names):
        """Parse & validate const_param_names."""
        model = self.model
        if not const_param_names: return []
        for name in const_param_names:
            if name not in model.param_names:
                raise AppException(f'{model.display_name} has parameters {", ".join(model.param_names)}, got {name}!')
        return const_param_names

    def get_residual(self, params):
        """Evaluate residual vector for the complete set of params; it is flattened so that it can be used by least_squares."""
        gamma_M = np.vstack([self.gamma_1, self.gamma_2])  # both dependent variables next to each other
        return (self.model.fun(self.x_1, self.T, *params) - gamma_M).flatten()

    def optimize(self):
        """Perform optimization of model parameters to fit the VLE data."""
        # sort model parameters per indices: those that are to be kept constant, those that will be optimized
        const_param_idxs = [self.model.param_names.index(name) for name in self.const_param_names]
        const_params, picked_params0 = pick_vector(self.params0, const_param_idxs)

        # wrapped residual as function of picked model parameters, which are merged with the const model parameters
        callback = lambda picked_params: self.get_residual(
            overlay_vectors(const_params, const_param_idxs, picked_params))

        # optimization itself, using built-in Levenberg-Marquardt algorithm
        result = least_squares(callback, picked_params0, method='lm')
        if result.status <= 0: raise AppException(f'Optimization failed with status {result.status}: {result.message}')
        self.result_params = overlay_vectors(const_params, const_param_idxs, result.x)

        # final objective function value, log optimization as complete
        self.resid_final = np.sum(np.square(result.fun))
        self.is_optimized = True

    def tabulate(self):
        """Tabulate model using result_params for each dataset."""
        self.tabulated_datasets = [VLE_Tabulation(self.model, self.result_params, vle) for vle in self.dataset_VLEs]

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        if self.is_optimized: echo('Optimization complete with following parameters:')
        else: echo('Optimization skipped, using initial parameters:')
        for (name, value) in zip(self.model.param_names, self.result_params):
            echo(f'  {name} = {value:.4g}')

        echo('')
        echo(f'Initial residual = {self.resid_init:.3g}')
        if self.is_optimized: echo(f'Final residual   = {self.resid_final:.3g}')

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
