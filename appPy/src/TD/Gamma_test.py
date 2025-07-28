import numpy as np
from scipy.optimize import least_squares
from scipy.interpolate import UnivariateSpline

from src.fit.utils import const_param_wrappers
from src.utils.io.echo import echo, ok_echo, err_echo, underline_echo
from src.utils.errors import AppException
from src.config import cfg, cst
from .VLE_models.NRTL import log_NRTL10, NRTL_params0
from .VLE import VLE

model_param_names = ['a_12', 'a_21', 'b_12', 'b_21', 'c_12', 'virB_1', 'virB_12', 'virB_2', 'err_1', 'err_2']
default_const_param_names = ['c_12']
count_active_params = lambda const_param_names: len(model_param_names) - len(const_param_names)
is_virial_enabled = lambda const_param_names: any(x not in const_param_names for x in ['virB_1', 'virB_12', 'virB_2'])


def phi_virial(V_m, x_1, B_1, B_12, B_2):
    """
    Calculate binary mixture fugacity coefficient using the integrated first-order virial equation.
    This treats the gas phase mixture as a single pseudo-component.
    Fugacity coefficient is calculated as integral of (z-1/p')dp' from 0 to p,
    where z = 1 + B/V_m.
    """
    x_2 = 1 - x_1
    B_mix = x_1**2 * B_1 + 2*x_1*x_2*B_12 + x_2**2 * B_2
    return np.exp(B_mix * V_m)


def NRTL_with_error(x_1, T, a_12, a_21, b_12, b_21, c_12, err_1, err_2):
    """
    Calculate activity coefficients using NRTL model with error terms on gamma_1(x_1=1), gamma_2(x_2=1).
    Such offset is thermodynamically impossible, which is why calculating it is useful as a consistency test.

    See log_NRTL10 for details on parameters.
    err_1, err_2 (float): offset of gamma_1(x_1=1), gamma_2(x_2=1) from 1
    return (np.array): activity coefficients as [gamma_1, gamma_2]
    """
    ln_gamma_1, ln_gamma_2 = log_NRTL10(x_1, T, a_12, a_21, b_12, b_21, c_12, 0, 0, 0, 0, 0)
    gamma_1 = np.exp(ln_gamma_1) + err_1
    gamma_2 = np.exp(ln_gamma_2) + err_2
    return np.array([gamma_1, gamma_2])


def weigh_by_x(x_1, resids):
    """Weigh gammas residuals by mole fractions to accent data points in pure region."""
    x_2 = 1 - x_1
    res1, res2 = resids
    return np.vstack([x_1 * res1, x_2 * res2])


# perform simple test if γ1, γ2 extrapolates to 1 for pure compounds, as it must
class Gamma_test(VLE):

    def __init__(self, compound1, compound2, dataset_name, const_param_names, c_12):
        """
        Perform the original "Gamma offset test" as object with results and methods for reporting & visualization.
        The basis of the test is to see if γ1, γ2 extends to one if we extrapolate VLE data to pure compounds, as it must.
        This is done by fitting modified NRTL + virial model with error terms on the data, and evaluating the deviations from one.
        The model is designed so that even with φ != 1, γ1, γ2 are still expected to extrapolate to one.

        compound1, compound2 (str): names of compounds
        dataset_name (str): name of dataset
        const_param_names (list of str): names of parameters to be kept constant during optimization.
        c_12 (float or None): override for NRTL parameter c_12, which is always excluded from optimization
        """
        super().__init__(compound1, compound2, dataset_name)
        self.keys_to_serialize = ['is_consistent', 'nparams', 'is_isobaric', 'n_data_points', 'n_active_params']
        self.const_param_names = const_param_names
        self.n_active_params = count_active_params(const_param_names)  # will be updated later
        self.virial_enabled = is_virial_enabled(const_param_names)

        params0 = np.concatenate((NRTL_params0, np.zeros(5)))
        if c_12 is not None: params0[model_param_names.index('c_12')] = c_12

        self.n_data_points = len(self.x_1)
        self.__process_const_param_names()
        self.virial_enabled = is_virial_enabled(const_param_names)
        if 'b_12' in self.const_param_names: params0[model_param_names.index('b_12')] = 0
        if 'b_21' in self.const_param_names: params0[model_param_names.index('b_21')] = 0

        self.V_m = self.p / cst.R * self.T  # p / cst.R * T (ideal gas approximation to avoid transcendental equation)
        V_m_spline = UnivariateSpline(self.x_1, self.V_m)
        self.V_m_1, self.V_m_2 = V_m_spline(1), V_m_spline(0)

        # the optimization itself, first with ideal gas
        params = self.__optimize(params0, self.const_param_names + ['virB_1', 'virB_12', 'virB_2'])
        # use the ideal gas results as initial estimate for virial optimization, otherwise it's quite unstable
        if self.virial_enabled: params = self.__optimize(params, self.const_param_names)

        self.nparams = dict(zip(model_param_names, params))
        [virB_1, virB_12, virB_2, err_1, err_2] = params[5:]
        self.delta_gamma_1, self.delta_gamma_2 = err_1, err_2

        # final results for report
        abs_tol_1 = cfg.gamma_abs_tol / 100
        self.is_consistent = abs(self.delta_gamma_2) <= abs_tol_1 and abs(self.delta_gamma_1) <= abs_tol_1

        # tabulate results for plotting
        self.x_tab = np.linspace(0, 1, cst.x_points_smooth_plot)
        V_m_tab = V_m_spline(self.x_tab)
        T_spline = UnivariateSpline(self.x_1, self.T)
        T_tab = T_spline(self.x_tab)
        self.alpha_tab_1, self.alpha_tab_2 = self.__alpha_model(self.x_tab, T_tab, V_m_tab, *params)
        self.phi_tab = phi_virial(V_m_tab, self.x_tab, virB_1, virB_12, virB_2)

    def __optimize(self, params0, const_param_names):
        var_params0, wrapped_fun, merge_params = const_param_wrappers(self.__get_full_residual, params0,
                                                                      const_param_names, model_param_names)
        result = least_squares(wrapped_fun, var_params0, method='lm')
        if result.status <= 0: raise AppException(f'Optimization failed with status {result.status}: {result.message}')
        return merge_params(result.x)

    def __process_const_param_names(self):
        # temperature-dependent NRTL terms not relevant for isothermal VLE, that is OK!
        if not self.is_isobaric:
            self.const_param_names += ['b_12', 'b_21']

        # not enough points? Try auto-disabling virial
        if self.virial_enabled and self.n_data_points <= count_active_params(self.const_param_names):
            self.const_param_names += ['virB_1', 'virB_12', 'virB_2']
            self.warn('Virial equation was disabled (not enough data points)')

        # not enough points? Try disabling temperature-dependent NRTL terms even for isobaric
        # Since they can't be disabled manually, disable also when barely enough data points to prevent warning.
        if self.is_isobaric and self.n_data_points <= count_active_params(self.const_param_names):
            self.const_param_names += ['b_12', 'b_21']
            self.warn('b_12 and b_21 NRTL parameters were excluded from optimization (not enough data points)')

        self.const_param_names = list(set(self.const_param_names))  # dedupe
        self.n_active_params = count_active_params(self.const_param_names)

        if self.n_active_params == self.n_data_points:
            self.warn(
                f'{self.n_active_params} parameters optimized on {self.n_data_points} data points: overfitting is likely!'
            )

        if self.n_data_points < self.n_active_params:
            raise AppException('Not enough data points, 4 are required at the very least.')

    def __get_full_residual(self, params):
        """
        Calculate residuals for least_squares optimization as difference between calculated alpha and experimental alpha.
        Note that VLE() does not consider vapor phase non-ideality, so the VLE.gamma is considered to be experimental alpha.
        """
        alpha_M = np.vstack([self.gamma_1, self.gamma_2])  # serialize both dependent variables
        raw_residuals = self.__alpha_model(self.x_1, self.T, self.V_m, *params) - alpha_M
        return weigh_by_x(self.x_1, raw_residuals).flatten()

    def __alpha_model(self, x_1, T, V_m, a_12, a_21, b_12, b_21, c_12, virB_1, virB_12, virB_2, err_1, err_2):
        """
        Get alpha using NRTL model with error terms and virial equation for fugacity coefficients,
        where alpha_i = gamma_i * phi_i_sat / phi
        """
        gamma_1, gamma_2 = NRTL_with_error(x_1, T, a_12, a_21, b_12, b_21, c_12, err_1, err_2)

        phi = phi_virial(V_m, x_1, virB_1, virB_12, virB_2)
        phi_1 = phi_virial(self.V_m_1, 1, virB_1, virB_12, virB_2)  # here only virB_1 is effective
        phi_2 = phi_virial(self.V_m_2, 0, virB_1, virB_12, virB_2)  # here only virB_2 is effective

        alpha_1 = gamma_1 * phi_1 / phi
        alpha_2 = gamma_2 * phi_2 / phi

        return np.array([alpha_1, alpha_2])

    def get_title(self):
        return f'γ test for {super().get_title()}'

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        dg_1, dg_2 = self.delta_gamma_1, self.delta_gamma_2
        echo(f'γ1(x1=1) = {(1 + dg_1):.3f}      |Δ| = {abs(dg_1*100):.1f}%')
        echo(f'γ2(x2=1) = {(1 + dg_2):.3f}      |Δ| = {abs(dg_2*100):.1f}%')

        template = lambda i, dg: f'NOT OK: γ{i}(x{i}=1) must be 1, but {abs(dg * 100):4.1f}% error was extrapolated (tolerance = {cfg.gamma_abs_tol}%)'
        abs_tol_1 = cfg.gamma_abs_tol / 100
        if abs(dg_2) > abs_tol_1:
            err_echo(template(i=2, dg=dg_2))
        if abs(dg_1) > abs_tol_1:
            err_echo(template(i=1, dg=dg_1))

        if self.is_consistent:
            ok_echo(f'OK, both γi(xi=1) are close to 1 (tolerance = {cfg.gamma_abs_tol}%)')
        echo('')
        echo('Final params:')
        for (name, value) in self.nparams.items():
            echo(f'{name:>8} = {value:.3g}')
        echo('')
