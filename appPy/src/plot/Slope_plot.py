import numpy as np
from matplotlib import pyplot as plt
from src.TD.Slope_test import Slope_test
from src.plot.plot_io import init_plot, finish_plot, x_dynamic_number_format


class Slope_plot(Slope_test):

    def plot_residuals(self, mode):
        init_plot(mode)

        plt.plot(self.x_1, self.P2P_res, 'Dk')
        plt.axhline(y=0, color='k', linestyle=':')
        plt.title(self.get_title())
        plt.xlim(0, 1)
        plt.xticks(np.linspace(0, 1, 11))
        plt.xlabel('$x_1$')
        plt.ylabel('residual')
        x_dynamic_number_format()

        return finish_plot(mode)

    def plot_derivations(self, mode):
        init_plot(mode)

        plt.plot(self.x_1, self.d_ln_gamma_1, 'Dr', label='d ln$\\gamma_1$ / d $x_1$')
        plt.plot(self.x_1, self.d_ln_gamma_2, 'vb', label='d ln$\\gamma_2$ / d $x_1$')
        plt.axhline(y=0, color='k', linestyle=':')
        plt.title(self.get_title())
        plt.xlim(0, 1)
        plt.xticks(np.linspace(0, 1, 11))
        plt.xlabel('$x_1$')
        plt.ylabel('d ln$\\gamma$ / d $x_1$')
        plt.legend()
        x_dynamic_number_format()

        return finish_plot(mode)
