import numpy as np
from matplotlib import pyplot as plt
from src.TD.Van_Ness_test import Van_Ness_test
from src.plot.plot_io import init_plot, finish_plot, x_dynamic_number_format


class Van_Ness_plot(Van_Ness_test):

    def plot(self, mode):
        init_plot(mode)

        plt.plot(self.x_1, self.residuals, 'Dk')
        plt.axhline(y=0, color='k', linestyle=':')
        plt.title(self.get_title())
        plt.xlim(0, 1)
        plt.xticks(np.linspace(0, 1, 11))
        plt.xlabel('$x_1$')
        plt.ylabel('$\\delta$ ln $\\gamma_1/\\gamma_2$')
        x_dynamic_number_format()

        return finish_plot(mode)
