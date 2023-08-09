from functools import reduce
import numpy as np
from matplotlib import pyplot as plt
from scipy.optimize import least_squares
from src.TD.models.van_Laar import van_Laar_with_T
from src.TD.models.NRTL import NRTL
from src.TD.VLE import VLE
from src.utils.Result import Result
from src.utils.errors import AppException
from src.utils.datasets import parse_datasets
from src.utils.echo import echo, underline_echo
from .Tabulate import Tabulate

supported_models = ['vanLaar', 'NRTL']
default_model = supported_models[0]

# squash a selected VLE property from list of VLEs into a single array
squash = lambda vles, prop: reduce(lambda acc, curr: np.concatenate((acc, curr)), [getattr(vle, prop) for vle in vles])


# create non-linear regression problem for given binary system datasets and selected model
class Fit(Result):

    def __init__(self, compound1, compound2, model, datasets, params):
        super().__init__()
        self.compound1 = compound1
        self.compound2 = compound2

        self.dataset_names = parse_datasets(compound1, compound2, datasets)

        self.model = model
        if not model in supported_models:
            raise AppException(f'Unknown model {model}.\nAvailable models: {", ".join(supported_models)}')
        if model == 'vanLaar' and len(self.dataset_names) > 1:
            self.warn('van Laar model is isothermal, be cautious when fitting multiple datasets of different pressure')
        self.model_fun = van_Laar_with_T if model == 'vanLaar' else NRTL

        self.params0 = np.ones(2 if model == 'vanLaar' else 5) * 0.5  # initial estimate
        self.params = None  # result of optimization

        self.tabulated_datasets = None  # T, x_1, y_1, gamma_1, gamma_2 tabulation of fitted model foreach dataset

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
        residual = lambda params: (self.model_fun(self.x_1, self.T, *params) - gamma_M).flatten()

        result = least_squares(residual, self.params0, method='lm')
        if result.status <= 0:
            raise AppException(f'Optimization failed with status {result.status}: {result.message}')
        self.params = result.x

    def tabulate(self):
        if self.model == 'vanLaar': is_T_const = True
        elif self.model == 'NRTL': is_T_const = False
        self.tabulated_datasets = [Tabulate(vle, self.model_fun, self.params, is_T_const) for vle in self.dataset_VLEs]

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        # TODO prettyprint params
        echo(f'Optimization complete with following parameters: {self.params}')

    def get_title(self):
        return f'Regression of {self.model} on {self.compound1}-{self.compound2} ({", ".join(self.dataset_names)})'

    def plot_xy_model(self):
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            vle.plot_xy(silent=True)
            plt.plot(tab.x_1, tab.y_1, '-k', label=self.model)
            plt.legend()
            plt.ion()
            plt.show()

    def plot_Txy_model(self):
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            vle.plot_Txy(silent=True)
            plt.plot(tab.y_1, tab.T, '-r', label=f'dew {self.model}')
            plt.plot(tab.x_1, tab.T, '-b', label=f'boil {self.model}')
            plt.legend()
            plt.ion()
            plt.show()

    def plot_gamma_model(self):
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            vle.plot_gamma(silent=True)
            plt.plot(tab.x_1, tab.gamma_1, '-r', label=f'$\\gamma_1$ {self.model}')
            plt.plot(tab.x_1, tab.gamma_2, '-b', label=f'$\\gamma_2$ {self.model}')
            plt.legend()
            plt.ion()
            plt.show()
