import numpy as np
from scipy.integrate import quad
from scipy.interpolate import UnivariateSpline
from matplotlib import pyplot as plt
from src.utils.underline import underline
from src.config import x_points_smooth_plot, rk_D_criterion, rk_quad_rel_tol
from .VLE import VLE


# perform Redlich-Kister test as object with results, and methods for visualization
class Redlich_Kister_test(VLE):

    def __init__(self, compound1, compound2, dataset_name):
        super().__init__(compound1, compound2, dataset_name)

        # function, the curve of which is evaluated
        self.curve = np.log(self.gamma_1) - np.log(self.gamma_2)
        self.curve_spline = UnivariateSpline(self.x_1, self.curve)

        # ||A|-|B|| means integrating the function as it is
        self.curve_diff, err_diff = quad(self.curve_spline, 0, 1)
        self.curve_diff = abs(self.curve_diff)

        # ||A|+|B|| means integrating |function|
        self.curve_sum, err_sum = quad(lambda x: abs(self.curve_spline(x)), 0, 1)

        # warn if scipy declares a large integration error
        rel_err_max = max(abs(err_diff / self.curve_diff), abs(err_sum / self.curve_sum))
        if rel_err_max > rk_quad_rel_tol:
            self.warn(
                f'WARNING: relative error of numerical integration is {rel_err_max:.1e}, limit is {rk_quad_rel_tol:.0e}. Calculation is to be considered unreliable.'
            )

        # the test criterion D
        self.D = self.curve_diff / self.curve_sum * 100
        self.is_consistent = self.D <= rk_D_criterion

    def report(self):
        print(underline(f'Redlich-Kister test for {self.compound1}-{self.compound2}, {self.dataset_name}'))
        self.report_warnings()
        print(f'D = {self.D:.1f}')
        if self.is_consistent:
            print(f'D < {rk_D_criterion:.0f} therefore data consistency cannot be determined :-)')
        else:
            print(f'D > {rk_D_criterion:.0f} therefore data consistency is disproven! :-(')
        print(f'\ta-b = {self.curve_diff:.4f}')
        print(f'\ta+b = {self.curve_sum:.4f}')
        print('')

    def plot_rk(self):
        x_tab = np.linspace(0, 1, x_points_smooth_plot)
        curve_tab = self.curve_spline(x_tab)

        plt.plot(self.x_1, self.curve, 'Dk')
        plt.plot(x_tab, curve_tab, '-k')
        plt.axhline(y=0, color='k', linestyle=':')
        plt.title(f'Redlich-Kister test for {self.get_title()}')
        plt.xlim(0, 1)
        plt.xlabel('$x_1$')
        plt.ylabel('ln $\\gamma_1/\\gamma_2$')
