import numpy as np
from scipy.optimize import least_squares
from scipy.odr import Model, Data, ODR
from src.config import cst
from src.TD.vapor_models.supported_models import supported_models
from src.utils.io.echo import echo, underline_echo
from .Fit import Fit
from .utils import RMS, AAD, const_param_wrappers


class Fit_Vapor(Fit):

    def __init__(self, compound, model_name, p_data, T_data, params0):
        """
        Create non-linear regression problem for given vapor pressure datasets and a selected model.
        Performs both normal non-linear regression, and orthogonal distance regression (ODR).

        compound (str): name of the compound.
        model_name (str): name of the model to be fitted.
        p_data (list of float): vector of pressure data.
        T_data (list of float): vector of temperature data.
        params0 (list of float): initial estimate of model parameters (ordered).
        """
        super().__init__(supported_models, model_name, params0)
        self.keys_to_serialize.extend([
            'is_p_optimized', 'is_T_p_optimized', 'odr_messages', 'nparams_p', 'nparams_T_p', 'RMS_p', 'AAD_p',
            'RMS_T_p', 'AAD_T_p', 'T_min', 'T_max'
        ])
        self.compound = compound
        self.p_data = np.array(p_data)
        self.T_data = np.array(T_data)
        # will be offered as model T_min & T_max
        self.T_min = np.min(T_data)
        self.T_max = np.max(T_data)

        self.nparams_p = self.params_p = self.params_T_p = self.nparams_T_p = None
        self.RMS_p = self.AAD_p = self.RMS_T_p = self.AAD_T_p = None
        self.T_tab = self.p_tab_p = self.p_tab_T_p = None
        self.is_p_optimized = self.is_T_p_optimized = False
        self.odr_messages = []  # scipy.ODR has an unusual output format, as array of messages, but no status

        # even for ODR, only p residuals are calculated for simplicity, so they may actually increase after ODR
        self.RMS0 = RMS(self.get_p_residuals(self.params0))
        self.AAD0 = AAD(self.get_p_residuals(self.params0))

    def get_p_residuals(self, params):
        """With given params, calculate residuals only of the dependent variable (p)."""
        p_calc = self.model.fun(self.T_data, *params)
        return p_calc - self.p_data

    def optimize_p(self):
        """Optimize the model params, considering only error of dependent variable (p)."""
        var_params0, wrapped_fun, merge_params = const_param_wrappers(self.get_p_residuals, self.params0,
                                                                      self.const_param_names, self.model.param_names)
        result = least_squares(wrapped_fun, var_params0, method='lm')
        if result.status <= 0:
            self.warn(f'p-optimization failed! Status {result.status}: {result.message}')
            return
        self.is_p_optimized = True
        self.params_p = merge_params(result.x)
        self.nparams_p = self.set_named_params(self.params_p)
        self.RMS_p = RMS(self.get_p_residuals(self.params_p))
        self.AAD_p = AAD(self.get_p_residuals(self.params_p))

    def optimize_T_p(self):
        """Optimize the model params, considering errors of both dependent (p) & independent (T) variables."""
        full_params0 = self.params_p if self.is_p_optimized else self.params0  # use intermediate params if available
        fun2wrap = lambda params, x: self.model.fun(x, *params)  # swap the order of params and x
        var_params0, wrapped_fun, merge_params = const_param_wrappers(fun2wrap, full_params0, self.const_param_names,
                                                                      self.model.param_names)
        try:
            odr_model = Model(wrapped_fun)
            odr_data = Data(self.T_data, self.p_data)
            odr = ODR(odr_data, odr_model, beta0=var_params0)
            odr_result = odr.run()
        except Exception as e:  # pylint: disable=broad-exception-caught
            self.warn(f'T,p-optimization failed with error: {e}')
            return
        self.is_T_p_optimized = True
        self.params_T_p = merge_params(odr_result.beta)
        self.nparams_T_p = self.set_named_params(self.params_T_p)
        self.RMS_T_p = RMS(self.get_p_residuals(self.params_T_p))
        self.AAD_T_p = AAD(self.get_p_residuals(self.params_T_p))
        self.odr_messages = odr_result.stopreason
        self.odr_messages = self.odr_messages if isinstance(self.odr_messages, list) else [self.odr_messages]

    def tabulate(self):
        self.T_tab = np.linspace(self.T_min, self.T_max, cst.x_points_smooth_plot)
        if self.is_p_optimized:
            self.p_tab_p = self.model.fun(self.T_tab, *self.params_p)
        if self.is_T_p_optimized:
            self.p_tab_T_p = self.model.fun(self.T_tab, *self.params_T_p)

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        echo(f'Temperature range: {self.T_min:.2f} - {self.T_max:.2f} K')
        echo('')

        echo('Optimized parameters as intermediate & final value:')
        for (name, p_p, p_T_p) in zip(self.model.param_names, self.params_p, self.params_T_p):
            echo(f'  {name} = {p_p:7.4g} {p_T_p:9.4g}')

        echo('')
        echo(f'Initial RMS = {self.RMS0:.3g}')
        echo(f'Initial AAD = {self.AAD0:.3g}')
        echo(f'Final RMS   = {self.RMS_T_p:.3g}')
        echo(f'Final AAD   = {self.AAD_T_p:.3g}')

    def get_title(self):
        return f'Regression of {self.model.display_name} on {self.compound}'
