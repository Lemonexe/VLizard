from matplotlib import pyplot as plt
from src.TD.Gamma_test import Gamma_test
from .VLE_plot import VLE_plot


class Gamma_plot(Gamma_test, VLE_plot):

    def plot_gamma_model(self):
        self.plot_gamma(silent=True)
        plt.plot(self.x_tab, self.gamma_tab_1, '-r', label='$\\gamma_1$ spline')
        plt.plot(self.x_tab, self.gamma_tab_2, '-b', label='$\\gamma_2$ spline')
        plt.legend()
        plt.ion()
        plt.show()
