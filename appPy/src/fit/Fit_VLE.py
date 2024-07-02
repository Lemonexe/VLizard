import numpy as np
from scipy.optimize import least_squares
from src.TD.VLE_models.supported_models import supported_models
from src.TD.VLE import VLE
from src.utils.io.echo import echo, underline_echo
from src.utils.errors import AppException
from src.utils.datasets import parse_datasets
from .Fit import Fit
from .VLE_Tabulation import VLE_Tabulation
from .utils import RMS, AAD, const_param_wrappers

# squash a selected VLE property from list of VLEs into a single array
squash = lambda vle_list, prop: np.concatenate([getattr(vle, prop) for vle in vle_list])


class Fit_VLE(Fit):

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
        super().__init__(supported_models, model_name, params0, const_param_names)
        self.keys_to_serialize.extend(['tabulated_datasets'])
        self.compound1 = compound1
        self.compound2 = compound2

        self.dataset_names = parse_datasets(compound1, compound2, datasets)
        self.tabulated_datasets = None  # T, x_1, y_1, y_2 gamma_1, gamma_2 tabulation of fitted model for each dataset
        self.dataset_VLEs = [VLE(compound1, compound2, dataset_name) for dataset_name in self.dataset_names]

        self.__check_model_suitability()

        # serialize all datasets to one array per property
        self.x_1 = squash(self.dataset_VLEs, 'x_1')
        self.T = squash(self.dataset_VLEs, 'T')
        self.gamma_1 = squash(self.dataset_VLEs, 'gamma_1')
        self.gamma_2 = squash(self.dataset_VLEs, 'gamma_2')

        self.RMS_init = RMS(self.get_residual(self.params0))
        self.AAD_init = AAD(self.get_residual(self.params0))

    def __check_model_suitability(self):
        """Check if the model is appropriate for given datasets."""
        if not self.model.is_gamma_T_fun and len(self.dataset_names) > 1:
            msg = f'{self.model.display_name} model is T independent, fitting of multiple datasets of different pressure is not recommended'
            self.warn(msg)

    def get_residual(self, params):
        """Evaluate residual vector for the complete set of params; it is flattened so that it can be used by least_squares."""
        gamma_M = np.vstack([self.gamma_1, self.gamma_2])  # both dependent variables next to each other
        return (self.model.fun(self.x_1, self.T, *params) - gamma_M).flatten()

    def optimize(self):
        """Perform optimization of model parameters to fit the VLE data."""
        var_params0, wrapped_fun, merge_params = const_param_wrappers(self.get_residual, self.params0,
                                                                      self.const_param_names, self.model.param_names)
        result = least_squares(wrapped_fun, var_params0, method='lm')
        if result.status <= 0: raise AppException(f'Optimization failed with status {result.status}: {result.message}')
        self.params = merge_params(result.x)
        self.nparams = self.set_named_params(self.params)

        # final objective function value, log optimization as complete
        self.RMS_final = RMS(result.fun)
        self.AAD_final = AAD(result.fun)
        self.is_optimized = True

    def tabulate(self):
        """Tabulate model using final params for each dataset."""
        self.tabulated_datasets = [VLE_Tabulation(self.model, self.params, vle) for vle in self.dataset_VLEs]

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        if self.is_optimized: echo('Optimization complete with following parameters:')
        else: echo('Optimization skipped, using initial parameters:')
        for (name, value) in zip(self.model.param_names, self.params):
            echo(f'  {name} = {value:.4g}')

        echo('')
        echo(f'Initial RMS = {self.RMS_init:.3g}')
        echo(f'Initial AAD = {self.AAD_init:.3g}')
        if self.is_optimized:
            echo(f'Final RMS   = {self.RMS_final:.3g}')
            echo(f'Final AAD   = {self.AAD_final:.3g}')

    def get_title(self):
        return f'Regression of {self.model.display_name} on {self.compound1}-{self.compound2} ({", ".join(self.dataset_names)})'
