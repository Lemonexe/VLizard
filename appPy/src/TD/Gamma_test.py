import numpy as np
from matplotlib import pyplot as plt
from scipy.optimize import least_squares
from src.utils.io.echo import echo, ok_echo, err_echo, underline_echo
from src.config import x_points_smooth_plot, gamma_abs_tol
from .VLE_models.van_Laar import van_Laar_with_error
from .VLE import VLE


# perform simple test if γ1, γ2 extrapolates to 1 for pure compounds, as it must
class Gamma_test(VLE):

    def __init__(self, compound1, compound2, dataset_name):
        super().__init__(compound1, compound2, dataset_name)
        self.keys_to_serialize = [
            'is_consistent', 'gamma_abs_tol', 'err_1', 'err_2', 'x_tab', 'gamma_tab_1', 'gamma_tab_2'
        ]
        self.gamma_abs_tol = gamma_abs_tol

        params0 = np.array([0.5, 0.5, 0, 0])  # initial [A_12, A_21, err_1, err_2]
        gamma_M = np.vstack([self.gamma_1, self.gamma_2])  # serialize both dependent variables

        # vector of residuals for least_squares
        residual = lambda params: (van_Laar_with_error(self.x_1, *params) - gamma_M).flatten()

        result = least_squares(residual, params0)
        if result.status <= 0: return  # don't evaluate further if least_squares finished with 0 or -1 (error state)
        [_, _, self.err_1, self.err_2] = self.params = result.x

        self.is_consistent = abs(self.err_2) <= gamma_abs_tol and abs(self.err_1) <= gamma_abs_tol

        self.x_tab = np.linspace(0, 1, x_points_smooth_plot)
        self.gamma_tab_1, self.gamma_tab_2 = van_Laar_with_error(self.x_tab, *self.params)

    def get_title(self):
        return f'γ test for {super().get_title()}'

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        err_1, err_2 = self.err_1, self.err_2
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
        plt.plot(self.x_tab, self.gamma_tab_1, '-r', label='$\\gamma_1$ spline')
        plt.plot(self.x_tab, self.gamma_tab_2, '-b', label='$\\gamma_2$ spline')
        plt.legend()
        plt.ion()
        plt.show()
