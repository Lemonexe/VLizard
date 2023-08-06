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

supported_models = ['vanLaar', 'NRTL']
default_model = supported_models[0]

# squash a selected VLE property from list of VLEs into a single array
squash = lambda VLEs, prop: reduce(lambda acc, curr: np.concatenate((acc, curr)), [getattr(VLE, prop) for VLE in VLEs])

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
            self.warn(f'van Laar model is isothermal, be cautious when fitting multiple datasets of different pressure')
        self.model_fun = van_Laar_with_T if model == 'vanLaar' else NRTL

        self.params0 = np.ones(2 if model == 'vanLaar' else 5) * 0.5 # initial estimate
        self.params = self.params0 * 0 # result of optimization

        self.VLEs = [VLE(compound1, compound2, dataset_name) for dataset_name in self.dataset_names]


        self.x_1 = squash(self.VLEs, 'x_1')
        self.y_1 = squash(self.VLEs, 'y_1')
        self.T = squash(self.VLEs, 'T')
        self.gamma_1 = squash(self.VLEs, 'gamma_1')
        self.gamma_2 = squash(self.VLEs, 'gamma_2')

        self.optimize()

    def optimize(self):
        gamma_matrix = np.vstack([self.gamma_1, self.gamma_2])  # serialize both dependent variables

        # vector of residuals for least_squares
        residual = lambda params: (self.model_fun(self.x_1, self.T, *params) - gamma_matrix).flatten()

        result = least_squares(residual, self.params0)
        if result.status <= 0:
            raise AppException(f'Optimization failed with status {result.status} and message {result.message}')
        self.params = result.x

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        echo(f'Optimization complete with following parameters: {self.params}')

    def get_title(self):
        return f'Regression of {self.model} on {self.compound1}-{self.compound2} ({", ".join(self.dataset_names)})'

    def plot_xy(self):
        pass

    def plot_Txy(self):
        pass

    def plot_gamma(self):
        pass