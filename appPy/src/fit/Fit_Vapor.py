import numpy as np
from scipy.optimize import least_squares, root
from src.config import cst
from src.TD.vapor_models.wagner import wagner_model
from src.TD.vapor_models.antoine import antoine_model
from src.utils.errors import AppException
from src.utils.io.echo import echo, underline_echo
from .Fit import Fit
from .utils import RMS, AAD, const_param_wrappers

default_model = antoine_model.name
supported_models = [antoine_model, wagner_model]
supported_model_names = [model.name for model in supported_models]


class Fit_Vapor(Fit):

    def __init__(self, compound, model_name, p_data, T_data, params0, skip_T_p_optimization=False):
        """
        Create non-linear regression problem for given vapor pressure datasets and a selected model.

        compound (str): name of the compound.
        model_name (str): name of the model to be fitted.
        p_data (list of float): vector of pressure data.
        T_data (list of float): vector of temperature data.
        params0 (list of float): initial estimate of model parameters (ordered).
        skip_T_p_optimization (bool): if True, only p residuals will be optimized.
        """
        super().__init__(supported_models, model_name, params0)
        self.keys_to_serialize.extend(['is_T_p_optimized', 'RMS_inter', 'AAD_inter', 'nparams_inter', 'T_min', 'T_max'])
        self.compound = compound
        self.p_data = np.array(p_data)
        self.T_data = np.array(T_data)
        self.T_min = np.min(T_data)
        self.T_max = np.max(T_data)

        # calculate weight factor for T residuals
        p_span = np.max(self.p_data) - np.min(self.p_data)
        T_span = self.T_max - self.T_min
        self.T_wt_factor = p_span / T_span

        self.T_tab = self.p_tab_inter = self.p_tab_final = None
        self.nparams_inter = self.params_inter = None
        self.RMS_inter = self.AAD_inter = None
        self.is_T_p_optimized = False  # in case of Fit_Vapor, Fit.is_optimized means is_p_optimized

        # in order to be consistent: if optimizing T,p, ALWAYS aim for T,p-residual, and if not, then always p-residual
        self.resid_fun = self.get_p_residuals if skip_T_p_optimization else self.get_T_p_residuals
        self.RMS_init = RMS(self.resid_fun(self.params0))
        self.AAD_init = AAD(self.resid_fun(self.params0))

    def get_p_residuals(self, params):
        """Calculate residuals for given params."""
        # calculating p residuals is easy, as p is dependent variable
        p_calc = self.model.fun(self.T_data, *params)
        return p_calc - self.p_data

    def get_T_residuals(self, params):
        # model is generally transcendental for T, so we need to solve to get T residuals
        # as if we were calculating boiling point at a given pressure
        T_calc = np.zeros(len(self.T_data))
        for i in range(len(self.T_data)):
            # pylint: disable=cell-var-from-loop
            T_boil_resid = lambda T: self.model.fun(T, *params) - self.p_data[i]
            sol = root(fun=T_boil_resid, x0=self.T_data[i], tol=cst.T_boil_tol)
            if not sol.success:
                raise AppException(f'Cannot get T,p residual – failed to find boiling point at {self.p_data[i]} kPa')
            T_calc[i] = sol.x[0]
        return T_calc - self.T_data

    def get_T_p_residuals(self, params):
        return np.concatenate((self.get_T_residuals(params) * self.T_wt_factor, self.get_p_residuals(params)))

    def optimize_p(self):
        """Optimize the model params, considering only error of dependent variable (p). When T,p-optimization is skipped, we are done, and the inter results stay as final."""
        var_params0, wrapped_fun, merge_params = const_param_wrappers(self.get_T_residuals, self.params0,
                                                                      self.const_param_names, self.model.param_names)
        result = least_squares(wrapped_fun, var_params0, method='lm')
        if result.status <= 0: raise AppException(f'p-optimization failed! Status {result.status}: {result.message}')
        self.is_optimized = True
        self.params_inter = self.params = merge_params(result.x)
        self.nparams_inter = self.nparams = self.set_named_params(self.params_inter)
        self.RMS_inter = self.RMS_final = RMS(self.resid_fun(self.params))
        self.AAD_inter = self.AAD_final = AAD(self.resid_fun(self.params))

    def optimize_T_p(self):
        """Optimize the model params, considering errors of both dependent (p) & independent (T) variables. Overwrite the final results."""
        if not self.is_optimized: raise AppException('Optimization of p residuals must be performed first')
        var_params_inter, wrapped_fun, merge_params = const_param_wrappers(self.get_T_p_residuals, self.params_inter,
                                                                           self.const_param_names,
                                                                           self.model.param_names)
        try:
            result = least_squares(wrapped_fun, var_params_inter, method='lm')
            if result.status <= 0:
                raise AppException(f'T,p-optimization failed! Status {result.status}: {result.message}')
        except AppException as e:
            self.warn(f'T,p-optimization failed with error: {e}')
            return
        self.is_T_p_optimized = True
        self.params = merge_params(result.x)
        self.nparams = self.set_named_params(self.params)
        self.RMS_final = RMS(self.resid_fun(self.params))
        self.AAD_final = AAD(self.resid_fun(self.params))

    def tabulate(self):
        self.T_tab = np.linspace(self.T_min, self.T_max, cst.x_points_smooth_plot)
        self.p_tab_inter = self.model.fun(self.T_tab, *self.params_inter)
        if self.is_T_p_optimized:
            self.p_tab_final = self.model.fun(self.T_tab, *self.params)

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        echo(f'Temperature range: {self.T_min:.2f} - {self.T_max:.2f} K')
        echo('')

        echo('Optimized parameters as intermediate & final value:')
        for (name, p_inter, p) in zip(self.model.param_names, self.params_inter, self.params):
            echo(f'  {name} = {p_inter:7.4g} {p:9.4g}')

        echo('')
        echo(f'Initial RMS = {self.RMS_init:.3g}')
        echo(f'Initial AAD = {self.AAD_init:.3g}')
        echo(f'Final RMS   = {self.RMS_final:.3g}')
        echo(f'Final AAD   = {self.AAD_final:.3g}')

    def get_title(self):
        return f'Regression of {self.model.display_name} on {self.compound}'
