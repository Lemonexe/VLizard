from matplotlib import pyplot as plt
from src.TD.Gamma_test import Gamma_test
from .VLE_plot import VLE_plot
from src.plot.plot_io import finish_plot, init_plot


class Gamma_plot(Gamma_test, VLE_plot):

    def plot_gamma_model(self, mode):
        init_plot(mode)

        self.plot_gamma(mode=None)

        plt.plot(self.x_tab, self.gamma_tab_1, '-r', label='$\\gamma_1$ van Laar')
        plt.plot(self.x_tab, self.gamma_tab_2, '-b', label='$\\gamma_2$ van Laar')
        plt.legend()

        return finish_plot(mode)
