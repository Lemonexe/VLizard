import numpy as np
from matplotlib import pyplot as plt
from src.TD.Fredenslund_test import Fredenslund_test
from src.plot.plot_io import init_plot, finish_plot, x_dynamic_number_format


class Fredenslund_plot(Fredenslund_test):

    def plot_g_E(self, mode):
        init_plot(mode)

        plt.plot(self.x_1, self.g_E_exp, 'Dk', label='experimental')
        plt.plot(self.x_tab, self.g_E_tab, '-g', label='Legendre model')
        plt.title(f'{self.get_title()}\n$g_E$')
        plt.xlim(0, 1)
        plt.xticks(np.linspace(0, 1, 11))
        plt.xlabel('$x_1$')
        plt.ylabel('$g_E$')

        plt.subplots_adjust(left=0.1, right=0.7)  # Reduce the right margin and make the plot lean to the left
        plt.legend(loc='center left', bbox_to_anchor=(1, 0.5))  # Legend outside center right
        x_dynamic_number_format()

        return finish_plot(mode)

    def plot_p_res(self, mode):
        init_plot(mode)

        plt.plot(self.x_1, self.p_res, 'Dk')
        plt.axhline(y=0, color='k', linestyle=':')
        plt.title(f'{self.get_title()}\n$p$ residuals')
        plt.xlim(0, 1)
        plt.xticks(np.linspace(0, 1, 11))
        plt.xlabel('$x_1$')
        plt.ylabel('$\\delta p$')
        x_dynamic_number_format()

        return finish_plot(mode)

    def plot_y_1_res(self, mode):
        init_plot(mode)

        plt.plot(self.x_1, self.y_1_res, 'Dr', label='$y_1$')
        plt.plot(self.x_1, self.y_2_res, 'vb', label='$y_2$')
        plt.axhline(y=0, color='k', linestyle=':')
        plt.title(f'{self.get_title()}\n$y$ residuals')
        plt.xlim(0, 1)
        plt.xticks(np.linspace(0, 1, 11))
        plt.xlabel('$x_1$')
        plt.ylabel('$\\Delta y$')

        plt.subplots_adjust(left=0.1, right=0.7)  # Reduce the right margin and make the plot lean to the left
        plt.legend(loc='center left', bbox_to_anchor=(1, 0.5))  # Legend outside center right
        x_dynamic_number_format()

        return finish_plot(mode)
