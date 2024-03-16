from matplotlib import pyplot as plt
from src.config import cfg
from src.utils.UoM import convert_T
from src.TD.VLE import VLE
from src.plot.plot_io import init_plot, finish_plot


class VLE_plot(VLE):

    def plot_xy(self, mode):
        """Plot x,y diagram."""
        init_plot(mode)

        plt.plot(self.x_1, self.y_1, 'Dk', label='data')
        plt.plot([0, 1], [0, 1], ':k')
        plt.xlim(0, 1)
        plt.ylim(0, 1)
        plt.title(f'xy diagram for {self.get_title()}')
        plt.xlabel('x')
        plt.ylabel('y')

        return finish_plot(mode)

    def plot_Txy(self, mode):
        """Plot T,x,y diagram."""
        init_plot(mode)
        T_disp = convert_T(self.T)
        plt.plot(self.y_1, T_disp, 'Dr', label='dew')
        plt.plot(self.x_1, T_disp, 'Db', label='boil')
        plt.xlim(0, 1)
        plt.title(f'Txy diagram for {self.get_title()}')
        plt.xlabel('x, y')
        plt.ylabel(f'T [{cfg.UoM_T}]')
        plt.legend()

        return finish_plot(mode)

    def plot_gamma(self, mode):
        """Plot diagram of activity coeffs per x."""
        init_plot(mode)

        plt.plot(self.x_1, self.gamma_1, '^r', label='$\\gamma_1$')
        plt.plot(self.x_1, self.gamma_2, 'vb', label='$\\gamma_2$')

        plt.axhline(y=1, color='k', linestyle=':')
        plt.xlim(0, 1)
        plt.title(f'Activity coefficients for {self.get_title()}')
        plt.xlabel('$x_1$')
        plt.ylabel('$\\gamma$')
        plt.legend()

        return finish_plot(mode)
