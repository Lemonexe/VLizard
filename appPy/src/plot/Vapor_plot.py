from matplotlib import pyplot as plt
from src.config import cfg
from src.utils.UoM import convert_T, convert_p
from src.TD.Vapor import Vapor
from src.plot.plot_io import init_plot, finish_plot


class Vapor_plot(Vapor):

    def plot(self, mode):
        """Plot p,T diagram for a compound."""
        init_plot(mode)
        t_disp = convert_T(self.T_tab)
        p_disp = convert_p(self.p_tab)
        plt.plot(t_disp, p_disp, '-k')
        plt.title(self.get_title())
        plt.xlabel(f'T [{cfg.UoM_T}]')
        plt.ylabel(f'p [{cfg.UoM_p}]')

        return finish_plot(mode)
