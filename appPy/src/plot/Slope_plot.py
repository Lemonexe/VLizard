from matplotlib import pyplot as plt
from src.TD.Slope_test import Slope_test
from src.plot.plot_io import init_plot, finish_plot


class Slope_plot(Slope_test):

    def plot_residuals(self, mode):
        init_plot(mode)

        plt.plot(self.x_1, self.P2P_res, 'Dk')
        plt.axhline(y=0, color='k', linestyle=':')
        plt.title(self.get_title())
        plt.xlim(0, 1)
        plt.xlabel('$x_1$')
        plt.ylabel('$d$ln$\\gamma$ resid')

        return finish_plot(mode)

    def plot_derivations(self, mode):
        init_plot(mode)

        plt.plot(self.x_1, self.d_ln_gamma_1, '^r', label='$d$ln$\\gamma_1$')
        plt.plot(self.x_1, self.d_ln_gamma_2, 'vb', label='$d$ln$\\gamma_2$')
        plt.axhline(y=0, color='k', linestyle=':')
        plt.title(self.get_title())
        plt.xlim(0, 1)
        plt.xlabel('$x_1$')
        plt.ylabel('$d$ln$\\gamma$')
        plt.legend()

        return finish_plot(mode)
