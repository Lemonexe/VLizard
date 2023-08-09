import numpy as np
from matplotlib import pyplot as plt
from scipy.optimize import least_squares
from src.utils.echo import echo, ok_echo, err_echo, underline_echo
from src.config import x_points_smooth_plot, gamma_abs_tol
from .models.van_Laar import van_Laar_with_error
from .VLE import VLE


# perform simple test if γ1, γ2 extrapolates to 1 for pure compounds, as it must
class Gamma_test(VLE):

    def __init__(self, compound1, compound2, dataset_name):
        super().__init__(compound1, compound2, dataset_name)

        params0 = np.array([0.5, 0.5, 0, 0])  # initial [A_12, A_21, err_1, err_2]
        gamma_M = np.vstack([self.gamma_1, self.gamma_2])  # serialize both dependent variables

        # vector of residuals for least_squares
        residual = lambda params: (van_Laar_with_error(self.x_1, *params) - gamma_M).flatten()

        result = least_squares(residual, params0)
        if result.status <= 0: return  # don't evaluate further if least_squares finished with 0 or -1 (error state)
        self.van_Laar_with_error_params = result.x
        [_, _, err_1, err_2] = result.x

        self.is_consistent = abs(err_2) <= gamma_abs_tol and abs(err_1) <= gamma_abs_tol

    def get_title(self):
        return f'γ test for {super().get_title()}'

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        [_, _, err_1, err_2] = self.van_Laar_with_error_params
        echo(f'γ1(x1=1) = {(1 + err_1):.3f}')
        echo(f'γ2(x2=1) = {(1 + err_2):.3f}')

        template = lambda i, err: f'NOT OK: γ{i}(x{i}=1) must be 1, but {abs(err*100):4.1f} % error was extrapolated (tolerance = {(gamma_abs_tol*100)} %)'
        if abs(err_2) > gamma_abs_tol:
            err_echo(template(i=2, err=err_2))
        if abs(err_1) > gamma_abs_tol:
            err_echo(template(i=1, err=err_1))

        if self.is_consistent:
            ok_echo(f'OK, both γi(xi=1) are close to 1 (tolerance = {(gamma_abs_tol*100)} %)')
        echo('')

    def plot_gamma_model(self):
        self.plot_gamma(silent=True)
        x_tab = np.linspace(0, 1, x_points_smooth_plot)
        gamma_tab = van_Laar_with_error(x_tab, *self.van_Laar_with_error_params)
        plt.plot(x_tab, gamma_tab[0, :], '-r', label='$\\gamma_1$ spline')
        plt.plot(x_tab, gamma_tab[1, :], '-b', label='$\\gamma_2$ spline')
        plt.legend()
        plt.ion()
        plt.show()
