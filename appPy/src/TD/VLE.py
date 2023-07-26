import click
import numpy as np
from matplotlib import pyplot as plt
from scipy.interpolate import UnivariateSpline
from src.utils.echo import underline_echo
from src.utils.array2tsv import array2tsv, vecs2cols
from src.utils.Result import Result
from src.utils.get_VLE_data import get_VLE_table
from src.config import x_points_smooth_plot, gamma_abs_tol, d_gamma_abs_tol
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
        gamma_1_spline = UnivariateSpline(self.x_1, self.gamma_1)
        gamma_2_spline = UnivariateSpline(self.x_1, self.gamma_2)
        self.gamma_1_spline = gamma_1_spline
        self.gamma_2_spline = gamma_2_spline

        d_gamma_1_spline = gamma_1_spline.derivative()
        d_gamma_2_spline = gamma_2_spline.derivative()

        gamma_1_tab = gamma_1_spline([0, 1])
        d_gamma_1_tab = d_gamma_1_spline([0, 1])
        gamma_2_tab = gamma_2_spline([0, 1])
        d_gamma_2_tab = d_gamma_2_spline([0, 1])

        self.is_consistent = True
        if abs(gamma_2_tab[0] - 1) > gamma_abs_tol:
            self.is_consistent = False
            self.warn(f'Data inconsistency: γ2(0) should be 1, but {gamma_2_tab[0]:.3f} was extrapolated')
        if abs(gamma_1_tab[1] - 1) > gamma_abs_tol:
            self.is_consistent = False
            self.warn(f'Data inconsistency: γ1(1) should be 1, but {gamma_1_tab[1]:.3f} was extrapolated')
        if abs(d_gamma_2_tab[0] - 0) > d_gamma_abs_tol:
            self.is_consistent = False
            self.warn(
                f'Possible data inconsistency: dγ2/dx1(0) should be 0, but {d_gamma_2_tab[0]:.3f} was extrapolated')
        if abs(d_gamma_1_tab[1] - 0) > d_gamma_abs_tol:
            self.is_consistent = False
            self.warn(
                f'Possible data inconsistency: dγ1/dx1(1) should be 0, but {d_gamma_1_tab[1]:.3f} was extrapolated')

        # click.echo(f'Activity coeffs for {self.get_title()}')
        # click.echo(f'{(gamma_2_tab[0]-1):.3f}     {(gamma_1_tab[1]-1):.3f}')
        # click.echo(f'{(d_gamma_2_tab[0]-0):.3f}     {(d_gamma_1_tab[1]-0):.3f}')
        # click.echo('')

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
    def plot_gamma(self):
        x_tab = np.linspace(0, 1, x_points_smooth_plot)
        gamma_1_tab = self.gamma_1_spline(x_tab)
        gamma_2_tab = self.gamma_2_spline(x_tab)

        plt.figure()
        plt.plot(self.x_1, self.gamma_1, '^r', label='$\\gamma_1$')
        plt.plot(self.x_1, self.gamma_2, 'vb', label='$\\gamma_2$')
        plt.plot(x_tab, gamma_1_tab, ':r', label='$\\gamma_1$ spline')
        plt.plot(x_tab, gamma_2_tab, ':b', label='$\\gamma_2$ spline')
        plt.axhline(y=1, color='k', linestyle=':')
        plt.xlim(0, 1)
        plt.title(f'Activity coefficients for {self.get_title()}')
        plt.xlabel('$x_1$')
        plt.ylabel('$\\gamma$')
        plt.legend()
        plt.ion()
        plt.show()
