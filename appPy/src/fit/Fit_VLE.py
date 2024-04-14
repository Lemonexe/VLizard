import numpy as np
from scipy.optimize import least_squares
from src.TD.VLE_models.NRTL import NRTL_model, NRTL10_model
from src.TD.VLE_models.van_Laar import van_Laar_model
from src.TD.VLE_models.margules import margules_model
from src.TD.VLE import VLE
from src.utils.io.echo import echo, underline_echo
from src.utils.errors import AppException
from src.utils.vector import pick_vector, overlay_vectors
from src.utils.datasets import parse_datasets
from .Fit import Fit
from .VLE_Tabulation import VLE_Tabulation
from .utils import RMS, AAD

default_model = NRTL_model.name
supported_models = [NRTL_model, NRTL10_model, van_Laar_model, margules_model]
supported_model_names = [model.name for model in supported_models]

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
        if not self.model.is_gamma_T_fun and len(self.dataset_names) > 1:
            msg = f'{self.model.display_name} model is T independent, fitting of multiple datasets of different pressure is not recommended'
            self.warn(msg)

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
        self.params = overlay_vectors(const_params, const_param_idxs, result.x)
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
