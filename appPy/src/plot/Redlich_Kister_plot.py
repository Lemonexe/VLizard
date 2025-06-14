import numpy as np
from matplotlib import pyplot as plt
from src.TD.Redlich_Kister_test import Redlich_Kister_test
from src.plot.plot_io import init_plot, finish_plot, x_dynamic_number_format


class Redlich_Kister_plot(Redlich_Kister_test):

    def plot(self, mode):
        init_plot(mode)

        plt.plot(self.x_1, self.curve, 'Dk')
        plt.plot(self.x_tab, self.curve_tab, '-k')
        plt.axhline(y=0, color='k', linestyle=':')
        plt.title(self.get_title())
        plt.xlim(0, 1)
        plt.xticks(np.linspace(0, 1, 11))
        plt.xlabel('$x_1$')
        plt.ylabel('ln $\\gamma_1/\\gamma_2$')
        x_dynamic_number_format()

        return finish_plot(mode)
