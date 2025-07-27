import numpy as np
from matplotlib import pyplot as plt
from src.TD.Gamma_test import Gamma_test
from .VLE_plot import VLE_plot
from src.plot.plot_io import finish_plot, init_plot, x_dynamic_number_format


class Gamma_plot(Gamma_test, VLE_plot):

    def plot_gamma_model(self, mode):
        init_plot(mode)

        self.plot_gamma(mode=None)

        plt.plot(self.x_tab, self.K_tab_1, '-r', label='$K_1$ model')
        plt.plot(self.x_tab, self.K_tab_2, '-b', label='$K_2$ model')

        plt.legend(loc='upper center')

        return finish_plot(mode)

    def plot_phi_model(self, mode):
        init_plot(mode)

        plt.plot(self.x_tab, self.phi_tab, '-k', label='$\\phi$ model')
        plt.xlim(0, 1)
        plt.ylim(0)
        plt.xticks(np.linspace(0, 1, 11))
        plt.title(f'Fugacity coefficient diagram for {self.get_title()}')
        plt.xlabel('$x_1$')
        plt.ylabel('$\\phi$')
        x_dynamic_number_format()

        return finish_plot(mode)
