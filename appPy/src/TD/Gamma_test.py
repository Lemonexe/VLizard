import numpy as np
from scipy.optimize import least_squares
from scipy.interpolate import UnivariateSpline

from src.utils.io.echo import echo, ok_echo, err_echo, underline_echo
from src.config import cfg, cst
from .VLE_models.NRTL import log_NRTL10, NRTL_params0
from .VLE import VLE

def phi_virial2(V_m, B, C):
    """
    Calculate fugacity coefficient using the integrated second-order virial equation.
    Note that you may pass p instead of V_m to fit different empirical parameters B and C, and then used them with p.
    This isn't thermodynamically correct, but a good empirical fit nonetheless.
    """
    return np.exp(B * V_m + C * V_m ** 2)

def NRTL_with_error(x_1, _T, a_12, a_21, b_12, b_21, c_12, err_1, err_2):
    """
    Calculate activity coefficients using NRTL model with error terms on gamma_1(x_1=1), gamma_2(x_2=1).
    Such offset is thermodynamically impossible, which is why calculating it is useful as a consistency test.

    See log_NRTL10 for details on parameters.
    err_1, err_2 (float): offset of gamma_1(x_1=1), gamma_2(x_2=1) from 1
    return (np.array): activity coefficients as [gamma_1, gamma_2]
    """
    ln_gamma_1, ln_gamma_2 = log_NRTL10(x_1, _T, a_12, a_21, b_12, b_21, c_12, 0, 0, 0, 0, 0)
    ln_gamma_1 = ln_gamma_1 + err_1
    ln_gamma_2 = ln_gamma_2 + err_2
    return np.exp(np.array([ln_gamma_1, ln_gamma_2]))

def alpha_model_with_error(x_1, p, _T, vir_B, vir_C, a_12, a_21, b_12, b_21, c_12, err_1, err_2):
    """
aaa
    """
    gamma_i = NRTL_with_error(x_1, _T, a_12, a_21, b_12, b_21, c_12, err_1, err_2)
    # integral of (z-1/p')dp' from 0 to p
    phi = np.exp(vir_B *p + vir_C * p**2)
    # print(np.mean(phi))
    alpha_i = gamma_i / phi  # activity coefficients divided by fugacity coefficients
    print([np.mean(alpha_i), np.mean(gamma_i), np.mean(phi)]) # oh my god it diverges so much it's cray
    return alpha_i

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
        self.keys_to_serialize = ['is_consistent', 'err_1', 'err_2', 'delta_gamma_1', 'delta_gamma_2']

        # alpha_i = gamma_i / phi_i
        # but VLE() does not consider vapor phase non-ideality, so the returned gamma can be considered alpha.
        alpha_M = np.vstack([self.gamma_1, self.gamma_2])  # serialize both dependent variables
        #p0_sign = np.sign(np.mean(alpha_M - 1))  # negative initial params if activity coefficients are TODO DELETE DIS
        # initial [vir_B, vir_C, a_12, a_21, b_12, b_21, c_12, err_1, err_2]
        params0 = np.concatenate((np.zeros(2), NRTL_params0, np.zeros(2)))

        # vector of residuals for least_squares
        print('alpha_M')
        print(alpha_M)
        residual = lambda params: weigh_by_x(self.x_1, alpha_model_with_error(self.x_1, self.p, self.T, *params) - alpha_M).flatten()

        result = least_squares(residual, params0)
        if result.status <= 0: return  # don't evaluate further if least_squares finished with 0 or -1 (error state)

        print('residual')
        print(residual(result.x))
        print('result')
        print(alpha_model_with_error(self.x_1, self.p, self.T, *result.x))

        [vir_B, vir_C, a_12, a_21, b_12, b_21, c_12, err_1, err_2] = result.x
        self.err_1, self.err_2 = err_1, err_2
        print(f'vir_B = {vir_B}')
        print(f'vir_C = {vir_C}')
        print(f'a_12 = {a_12}')
        print(f'a_21 = {a_21}')
        print(f'b_12 = {b_12}')
        print(f'b_21 = {b_21}')
        print(f'c_12 = {c_12}')
        print(f'err_1 = {err_1}')
        print(f'err_2 = {err_2}')

        p_spline = UnivariateSpline(self.x_1, self.p)
        print(p_spline(1))
        print(p_spline(0))



        phi_1 = phi_virial2(p_spline(1), vir_B, vir_C)
        phi_2 = phi_virial2(p_spline(0), vir_B, vir_C)

        print(f'phi_1 = {phi_1}')
        print(f'phi_2 = {phi_2}')

        self.delta_gamma_1 = np.exp(self.err_1) - phi_1
        self.delta_gamma_2 = np.exp(self.err_2) - phi_2

        abs_tol_1 = cfg.gamma_abs_tol / 100
        self.is_consistent = abs(self.err_2) <= abs_tol_1 and abs(self.err_1) <= abs_tol_1

        self.x_tab = np.linspace(0, 1, cst.x_points_smooth_plot)
        self.gamma_tab_i = NRTL_with_error(self.x_tab, 0, a_12, a_21, b_12, b_21, c_12, err_1, err_2)
        self.gamma_tab_1, self.gamma_tab_2 = self.gamma_tab_i

    def get_title(self):
        return f'γ test for {super().get_title()}'

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        err_1, err_2 = self.err_1, self.err_2
        dg_1, dg_2 = self.delta_gamma_1, self.delta_gamma_2
        echo(f'γ1(x1=1) = {(1 + dg_1):.3f}      |Δ| = {abs(dg_1*100):.1f}%')
        echo(f'γ2(x2=1) = {(1 + dg_2):.3f}      |Δ| = {abs(dg_2*100):.1f}%')
        echo(f'E_1 = {err_1:.2e}')
        echo(f'E_2 = {err_2:.2e}')

        template = lambda i, dg: f'NOT OK: γ{i}(x{i}=1) must be 1, but {abs(dg * 100):4.1f}% error was extrapolated (tolerance = {cfg.gamma_abs_tol}%)'
        abs_tol_1 = cfg.gamma_abs_tol / 100
        if abs(dg_2) > abs_tol_1:
            err_echo(template(i=2, dg=dg_2))
        if abs(dg_1) > abs_tol_1:
            err_echo(template(i=1, dg=dg_1))

        if self.is_consistent:
            ok_echo(f'OK, both γi(xi=1) are close to 1 (tolerance = {cfg.gamma_abs_tol}%)')
        echo('')
