import click
import numpy as np
from matplotlib import pyplot as plt
from scipy.optimize import least_squares
from src.utils.TD.van_Laar import van_Laar_with_error
from src.utils.echo import underline_echo
from src.utils.array2tsv import array2tsv, vecs2cols
from src.utils.Result import Result
from src.utils.get_VLE_data import get_VLE_table
from src.config import x_points_smooth_plot, gamma_abs_tol
from .Antoine import Antoine


# unpack the basic necessary data into this object rich with derived physical quantities + metadata
class VLE(Result):

    def __init__(self, compound1, compound2, dataset_name):
        super().__init__()
        self.compound1 = compound1
        self.compound2 = compound2
        self.dataset_name = dataset_name

        table = get_VLE_table(compound1, compound2, dataset_name)

        (self.p, self.T, self.x_1, self.y_1) = table.T
        self.x_2 = 1 - self.x_1
        self.y_2 = 1 - self.y_1

        antoine_1 = Antoine(compound1)
        antoine_2 = Antoine(compound2)
        T_data_bounds = (np.min(self.T), np.max(self.T))
        antoine_1.check_T_bounds(*T_data_bounds)
        antoine_2.check_T_bounds(*T_data_bounds)
        self.merge_status(antoine_1, antoine_2)
        self.antoine_fun_1 = antoine_1.antoine_fun
        self.antoine_fun_2 = antoine_2.antoine_fun

        self.ps_1 = self.antoine_fun_1(self.T)
        self.ps_2 = self.antoine_fun_2(self.T)

        self.gamma_1 = self.y_1 * self.p / self.x_1 / self.ps_1
        self.gamma_2 = self.y_2 * self.p / self.x_2 / self.ps_2

        # perform simple test if γi & dγi/dx1 behave as they should
        self.evaluate_gamma()

    def evaluate_gamma(self):
        params0 = np.array([0.5, 0.5, 0, 0])  # initial [A_12, A_21, err_1, err_2]
        y_matrix = np.vstack([self.gamma_1, self.gamma_2])  # serialize both dependent variables

        # vector of residuals for least_squares
        residual = lambda params: (van_Laar_with_error(self.x_1, *params) - y_matrix).flatten()

        result = least_squares(residual, params0)
        if result.status <= 0: return  # don't evaluate further if least_squares finished with 0 or -1 (error state)
        self.van_Laar_with_error_params = result.x
        [_A_12, _A_21, err_1, err_2] = result.x

        self.is_consistent = True
        template = lambda i, gamma: f'Data inconsistency: γ{i}(x{i}=1) must be 1, but {gamma:.3f} was extrapolated (tolerance is {(gamma_abs_tol*100)} %)'
        if abs(err_2) > gamma_abs_tol:
            self.is_consistent = False
            self.warn(template(2, (1 + err_2)))
        if abs(err_1) > gamma_abs_tol:
            self.is_consistent = False
            self.warn(template(1, (1 + err_1)))

    def report(self):
        underline_echo(f'Activity coeffs for {self.get_title()}')
        self.report_warnings()

        # pretty-print a table of following vectors
        headlines = ['  x1', 'γ1', 'γ2']
        table = vecs2cols(self.x_1, self.gamma_1, self.gamma_2)
        click.echo(array2tsv(table, headlines=headlines, format_spec='{:6.3f}'))
        click.echo('')

    def get_title(self):
        return f'{self.compound1}-{self.compound2}, {self.dataset_name}'

    # plot x,y diagram
    def plot_xy(self):
        plt.figure()
        plt.plot(self.x_1, self.y_1, 'Dk')
        plt.plot([0, 1], [0, 1], ':k')
        plt.xlim(0, 1)
        plt.ylim(0, 1)
        plt.title(f'xy diagram for {self.get_title()}')
        plt.xlabel('x')
        plt.ylabel('y')
        plt.ion()
        plt.show()

    # plot T,x,y diagram
    def plot_Txy(self):
        plt.figure()
        plt.plot(self.y_1, self.T, 'Dr', label='dew')
        plt.plot(self.x_1, self.T, 'Db', label='boil')
        plt.xlim(0, 1)
        plt.title(f'Txy diagram for {self.get_title()}')
        plt.xlabel('x, y')
        plt.ylabel('T [K]')
        plt.legend()
        plt.ion()
        plt.show()

    # plot diagram of activity coeffs per x
    def plot_gamma(self, draw_model=False):
        plt.figure()
        plt.plot(self.x_1, self.gamma_1, '^r', label='$\\gamma_1$')
        plt.plot(self.x_1, self.gamma_2, 'vb', label='$\\gamma_2$')

        if draw_model:
            x_tab = np.linspace(0, 1, x_points_smooth_plot)
            gamma_tab = van_Laar_with_error(x_tab, *self.van_Laar_with_error_params)
            plt.plot(x_tab, gamma_tab[0, :], ':r', label='$\\gamma_1$ spline')
            plt.plot(x_tab, gamma_tab[1, :], ':b', label='$\\gamma_2$ spline')

        plt.axhline(y=1, color='k', linestyle=':')
        plt.xlim(0, 1)
        plt.title(f'Activity coefficients for {self.get_title()}')
        plt.xlabel('$x_1$')
        plt.ylabel('$\\gamma$')
        plt.legend()
        plt.ion()
        plt.show()
