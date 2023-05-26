import numpy as np
from matplotlib import pyplot as plt
from src.utils.underline import underline
from src.config import x_points_smooth_plot, rk_D_criterion
from .Area import Area


# perform Redlich-Kister area test as object with results and methods for reporting & visualization
class Redlich_Kister_test(Area):

    def __init__(self, compound1, compound2, dataset_name):
        super().__init__(compound1, compound2, dataset_name)

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
            print(f'D < {self.criterion:.0f} → OK')
            print('(data consistency is proven)')
        else:
            print(f'D > {self.criterion:.0f} → NOT OK')
            print('(data consistency is disproven)')
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
