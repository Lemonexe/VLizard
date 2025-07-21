import numpy as np
from scipy.optimize import least_squares
from scipy.interpolate import UnivariateSpline

from src.utils.io.echo import echo, ok_echo, err_echo, underline_echo
from src.utils.errors import AppException
from src.config import cfg, cst
from .VLE_models.NRTL import log_NRTL10, NRTL_params0
from .VLE import VLE

# TODO:
# - what if gamma < 1, remove TODO DELETE DIS
#   - does not work, so try to fix c_12 first...
# - refactor fns to methods
# - UI
# - code commentary


def phi_virial2(V_m, x_1, B_1, B_12, B_2):
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


def alpha_model_with_error(x_1, T, V_m, V_m_1, V_m_2, virB_1, virB_12, virB_2, a_12, a_21, b_12, b_21, c_12, err_1,
                           err_2):
    """
    Get alpha using NRTL model with error terms and virial equation for fugacity coefficients.
    """
    gamma_1, gamma_2 = NRTL_with_error(x_1, T, a_12, a_21, b_12, b_21, c_12, err_1, err_2)

    phi = phi_virial2(V_m, x_1, virB_1, virB_12, virB_2)
    phi_1 = phi_virial2(V_m_1, 1, virB_1, virB_12, virB_2)  # here only virB_1 is effective
    phi_2 = phi_virial2(V_m_2, 0, virB_1, virB_12, virB_2)  # here only virB_2 is effective

    alpha_1 = gamma_1 * phi_1 / phi
    alpha_2 = gamma_2 * phi_2 / phi

    return np.array([alpha_1, alpha_2])


def weigh_by_x(x_1, resids):
    """Weigh gammas residuals by mole fractions to accent data points in pure region."""
    x_2 = 1 - x_1
    res1, res2 = resids
    return np.vstack([x_1 * res1, x_2 * res2])


# perform simple test if γ1, γ2 extrapolates to 1 for pure compounds, as it must
class Gamma_test(VLE):

    def __init__(self, compound1, compound2, dataset_name):
        """
        Perform home-baked "gamma test" as object with results and methods for reporting & visualization.
        The basis of the test is to see if γ1, γ2 goes to one if we extrapolate VLE data to pure compounds, as it must.
        This is done by fitting modified van Laar model with error terms on the data, and evaluating the deviations from one.

        compound1, compound2 (str): names of compounds
        dataset_name (str): name of dataset
        """
        super().__init__(compound1, compound2, dataset_name)
        self.keys_to_serialize = ['is_consistent', 'delta_gamma_1', 'delta_gamma_2', 'phi_1', 'phi_2']

        x_1, p, T = self.x_1, self.p, self.T

        # alpha_i = gamma_i * phi_i_sat / phi
        # but VLE() does not consider vapor phase non-ideality, so the returned gamma can be considered alpha.
        alpha_M = np.vstack([self.gamma_1, self.gamma_2])  # serialize both dependent variables
        #p0_sign = np.sign(np.mean(alpha_M - 1))  # negative initial params if activity coefficients are TODO DELETE DIS
        # initial [virB_1, virB_12, virB_2, a_12, a_21, b_12, b_21, c_12, err_1, err_2]
        params0 = np.concatenate((np.zeros(3), NRTL_params0, np.zeros(2)))

        # p / cst.R * T
        V_m = p / cst.R * T
        V_m_spline = UnivariateSpline(x_1, V_m)
        V_m_1 = V_m_spline(1)
        V_m_2 = V_m_spline(0)

        # vector of residuals for least_squares
        residual = lambda params: weigh_by_x(x_1,
                                             alpha_model_with_error(x_1, T, V_m, V_m_1, V_m_2, *params) - alpha_M
                                             ).flatten()

        result = least_squares(residual, params0)
        if result.status <= 0: raise AppException(f'Optimization failed with status {result.status}: {result.message}')

        [virB_1, virB_12, virB_2, a_12, a_21, b_12, b_21, c_12, err_1, err_2] = result.x
        self.delta_gamma_1, self.delta_gamma_2 = err_1, err_2

        self.phi_1 = phi_virial2(V_m_1, 1, virB_1, virB_12, virB_2)
        self.phi_2 = phi_virial2(V_m_2, 0, virB_1, virB_12, virB_2)

        abs_tol_1 = cfg.gamma_abs_tol / 100
        self.is_consistent = abs(self.delta_gamma_2) <= abs_tol_1 and abs(self.delta_gamma_1) <= abs_tol_1

        self.x_tab = np.linspace(0, 1, cst.x_points_smooth_plot)
        self.V_m_tab = V_m_spline(self.x_tab)
        T_spline = UnivariateSpline(x_1, T)
        self.T_tab = T_spline(self.x_tab)
        alpha_tab_i = alpha_model_with_error(self.x_tab, self.T_tab, self.V_m_tab, V_m_1, V_m_2, virB_1, virB_12,
                                             virB_2, a_12, a_21, b_12, b_21, c_12, err_1, err_2)
        self.alpha_tab_1, self.alpha_tab_2 = alpha_tab_i

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
        echo('Details:')
        echo(f'φ(x1=1) = {self.phi_1:.3f}')
        echo(f'φ(x2=1) = {self.phi_2:.3f}')
        echo('')
