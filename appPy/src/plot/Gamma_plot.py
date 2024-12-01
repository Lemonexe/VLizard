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

        plt.subplots_adjust(left=0.1, right=0.7)  # Reduce the right margin and make the plot lean to the left
        plt.legend(loc='center left', bbox_to_anchor=(1, 0.5))  # Legend outside center right

        return finish_plot(mode)
