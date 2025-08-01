import numpy as np
from matplotlib import pyplot as plt
from src.config import cfg
from src.utils.UoM import convert_T, convert_p
from src.TD.VLE import VLE
from src.plot.plot_io import init_plot, finish_plot, x_dynamic_number_format, y_dynamic_number_format


class VLE_plot(VLE):

    def plot_xy(self, mode):
        """Plot x,y diagram."""
        init_plot(mode)

        plt.plot(self.x_1, self.y_1, 'Dk', label='data')
        plt.plot([0, 1], [0, 1], ':k')
        plt.xlim(0, 1)
        plt.ylim(0, 1)
        plt.xticks(np.linspace(0, 1, 11))
        plt.yticks(np.linspace(0.1, 1, 10))  # shared 0 tick for y and x
        plt.title(f'xy diagram for {self.get_title()}')
        plt.xlabel('x')
        plt.ylabel('y')
        x_dynamic_number_format()
        y_dynamic_number_format()

        return finish_plot(mode)

    def plot_Txy(self, mode):
        """Plot T,x,y diagram."""
        init_plot(mode)
        T_disp = convert_T(self.T)
        plt.plot(self.y_1, T_disp, 'Dr', label='dew')
        plt.plot(self.x_1, T_disp, 'vb', label='boil')
        plt.xlim(0, 1)
        plt.xticks(np.linspace(0, 1, 11))
        plt.title(f'Txy diagram for {self.get_title()}')
        plt.xlabel('$x_1, y_1$')
        plt.ylabel(f'T [{cfg.UoM_T}]')
        plt.legend()
        x_dynamic_number_format()

        return finish_plot(mode)

    def plot_pxy(self, mode):
        """Plot p,x,y diagram."""
        init_plot(mode)
        p_disp = convert_p(self.p)
        plt.plot(self.x_1, p_disp, 'vb', label='boil')
        plt.plot(self.y_1, p_disp, 'Dr', label='dew')
        plt.xlim(0, 1)
        plt.xticks(np.linspace(0, 1, 11))
        plt.title(f'pxy diagram for {self.get_title()}')
        plt.xlabel('$x_1, y_1$')
        plt.ylabel(f'p [{cfg.UoM_p}]')
        plt.legend()
        x_dynamic_number_format()

        return finish_plot(mode)

    def plot_gamma(self, mode):
        """Plot diagram of activity coeffs per x."""
        init_plot(mode)

        plt.plot(self.x_1, self.gamma_1, 'Dr', label='$\\gamma_1$')
        plt.plot(self.x_1, self.gamma_2, 'vb', label='$\\gamma_2$')

        plt.axhline(y=1, color='k', linestyle=':')
        plt.xlim(0, 1)
        plt.xticks(np.linspace(0, 1, 11))
        plt.title(f'Activity coefficients for {self.get_title()}')
        plt.xlabel('$x_1$')
        plt.ylabel('$\\gamma$')
        plt.legend()
        x_dynamic_number_format()

        return finish_plot(mode)
