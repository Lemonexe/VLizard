from functools import reduce
import numpy as np
from matplotlib import pyplot as plt
from scipy.optimize import least_squares
from src.TD.models.van_Laar import van_Laar_model
from src.TD.models.NRTL import NRTL_model
from src.TD.VLE import VLE
from src.utils.Result import Result
from src.utils.errors import AppException
from src.utils.datasets import parse_datasets
from src.utils.echo import echo, underline_echo
from .Tabulate import Tabulate

default_model = 'vanLaar'
supported_models = {'vanLaar': van_Laar_model, 'NRTL': NRTL_model}

# squash a selected VLE property from list of VLEs into a single array
squash = lambda vles, prop: reduce(lambda acc, curr: np.concatenate((acc, curr)), [getattr(vle, prop) for vle in vles])


# create non-linear regression problem for given binary system datasets and selected model
# optionally with list of initial params (or None), and/or indices which parameters to keep constant (or None)
class Fit(Result):

    # TODO consts -> params
    def __init__(self, compound1, compound2, model_name, datasets, params, consts):
        super().__init__()
        self.compound1 = compound1
        self.compound2 = compound2

        self.dataset_names = parse_datasets(compound1, compound2, datasets)

        if not model_name in supported_models:
            raise AppException(f'Unknown model {model_name}.\nAvailable models: {", ".join(supported_models.keys())}')
        self.model = model = supported_models[model_name]

        if not model.is_gamma_T_fun and len(self.dataset_names) > 1:
            msg = f'{model.name} model is T independent, fitting of multiple datasets of different pressure is not recommended'
            self.warn(msg)

        self.params0 = params or model.params0  # use either given params or default model params as initial estimate
        self.params = None  # result of optimization

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

        # vector of residuals for least_squares
        residual = lambda params: (self.model.fun(self.x_1, self.T, *params) - gamma_M).flatten()

        result = least_squares(residual, self.params0, method='lm')
        if result.status <= 0:
            raise AppException(f'Optimization failed with status {result.status}: {result.message}')
        self.params = result.x

    def tabulate(self):
        self.tabulated_datasets = [Tabulate(vle, self.model, self.params) for vle in self.dataset_VLEs]

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        echo('Optimization complete with following parameters:')
        for (name, value) in zip(self.model.param_names, self.params):
            echo(f'  {name} = {value:.4g}')

    def get_title(self):
        return f'Regression of {self.model.name} on {self.compound1}-{self.compound2} ({", ".join(self.dataset_names)})'

    def plot_xy_model(self):
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            vle.plot_xy(silent=True)
            plt.plot(tab.x_1, tab.y_1, '-k', label=self.model.name)
            plt.legend()
            plt.ion()
            plt.show()

    def plot_Txy_model(self):
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            vle.plot_Txy(silent=True)
            plt.plot(tab.y_1, tab.T, '-r', label=f'dew {self.model.name}')
            plt.plot(tab.x_1, tab.T, '-b', label=f'boil {self.model.name}')
            plt.legend()
            plt.ion()
            plt.show()

    def plot_gamma_model(self):
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            vle.plot_gamma(silent=True)
            plt.plot(tab.x_1, tab.gamma_1, '-r', label=f'$\\gamma_1$ {self.model.name}')
            plt.plot(tab.x_1, tab.gamma_2, '-b', label=f'$\\gamma_2$ {self.model.name}')
            plt.legend()
            plt.ion()
            plt.show()
