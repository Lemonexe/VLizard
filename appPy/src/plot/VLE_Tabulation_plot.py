import numpy as np
from matplotlib import pyplot as plt
from src.config import cfg
from src.utils.UoM import convert_T
from src.fit.VLE_Tabulation import VLE_Tabulation
from src.plot.plot_io import init_plot, finish_plot, x_dynamic_number_format, y_dynamic_number_format


class VLE_Tabulation_plot(VLE_Tabulation):

    def plot_xy(self, mode):
        """Plot x,y diagram."""
        init_plot(mode)

        plt.plot(self.x_1, self.y_1, '-k', label=self.model_name)
        plt.plot([0, 1], [0, 1], ':k')
        plt.xlim(0, 1)
        plt.ylim(0, 1)
        plt.xticks(np.linspace(0, 1, 11))
        plt.yticks(np.linspace(0.1, 1, 10))  # shared 0 tick for y and x
        plt.xlabel('x')
        plt.ylabel('y')
        plt.title(f'Calculated xy diagram for {self.title}')
        x_dynamic_number_format()
        y_dynamic_number_format()

        return finish_plot(mode)

    def plot_Txy(self, mode):
        """Plot T,x,y diagram."""
        init_plot(mode)
        T_disp = convert_T(self.T)
        plt.plot(self.y_1, T_disp, '-r', label=f'dew {self.model_name}')
        plt.plot(self.x_1, T_disp, '-b', label=f'boil {self.model_name}')
        plt.xlim(0, 1)
        plt.xticks(np.linspace(0, 1, 11))
        plt.xlabel('x, y')
        plt.ylabel(f'T [{cfg.UoM_T}]')
        plt.title(f'Calculated Txy diagram for {self.title}')
        plt.legend()
        x_dynamic_number_format()

        return finish_plot(mode)

    def plot_gamma(self, mode):
        """Plot diagram of activity coeffs per x."""
        init_plot(mode)

        plt.plot(self.x_1, self.gamma_1, '-r', label=f'$\\gamma_1$ {self.model_name}')
        plt.plot(self.x_1, self.gamma_2, '-b', label=f'$\\gamma_2$ {self.model_name}')

        plt.axhline(y=1, color='k', linestyle=':')
        plt.xlim(0, 1)
        plt.xticks(np.linspace(0, 1, 11))
        plt.xlabel('$x_1$')
        plt.ylabel('$\\gamma$')
        plt.title(f'Calculated activity coefficients for {self.title}')
        plt.legend()
        x_dynamic_number_format()

        return finish_plot(mode)
