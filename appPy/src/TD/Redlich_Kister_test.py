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
        gamma_1, gamma_2, x_1 = self.gamma_1, self.gamma_2, self.x_1

        # the "curve" is a function which will be integrated
        self.curve = np.log(gamma_1) - np.log(gamma_2)
        self.curve_spline = UnivariateSpline(x_1, self.curve)

        # ||A|-|B|| means integrating the function as it is
        self.curve_dif, err_dif = quad(self.curve_spline, 0, 1)
        self.curve_dif = abs(self.curve_dif)

        # ||A|+|B|| means integrating |function|
        self.curve_sum, err_sum = quad(lambda x: abs(self.curve_spline(x)), 0, 1)

        # warn if scipy declares a large integration error
        rel_err_max = max(abs(err_dif / self.curve_dif), abs(err_sum / self.curve_sum))
        if rel_err_max > rk_quad_rel_tol:
            self.warn(
                f'WARNING: relative error of numerical integration is {rel_err_max:.1e}, limit is {rk_quad_rel_tol:.0e}. Calculation is to be considered unreliable.'
            )
        self.evaluate()

    def evaluate(self):
        # the test criterion D [%]
        self.D = self.curve_dif / self.curve_sum * 100
        self.is_consistent = self.D <= rk_D_criterion
        self.criterion = rk_D_criterion

    def get_title(self):
        return f'Redlich-Kister test for {super().get_title()}'

    def report(self):
        print(underline(self.get_title()))
        self.report_warnings()
        print(f'D = {self.D:.1f}')
        if self.is_consistent:
            print(f'D < {self.criterion:.0f} therefore data consistency cannot be determined :-)')
        else:
            print(f'D > {self.criterion:.0f} therefore data consistency is disproven! :-(')
        print(f'\ta-b = {self.curve_dif:.4f}')
        print(f'\ta+b = {self.curve_sum:.4f}')
        print('')

    def plot(self):
        # smooth tabelation of curve
        x_tab = np.linspace(0, 1, x_points_smooth_plot)
        curve_tab = self.curve_spline(x_tab)

        plt.plot(self.x_1, self.curve, 'Dk')
        plt.plot(x_tab, curve_tab, '-k')
        plt.axhline(y=0, color='k', linestyle=':')
        plt.title(self.get_title())
        plt.xlim(0, 1)
        plt.xlabel('$x_1$')
        plt.ylabel('ln $\\gamma_1/\\gamma_2$')
