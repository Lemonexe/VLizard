from matplotlib import pyplot as plt
from src.config import cfg
from src.TD.Vapor import Vapor
from src.plot.plot_io import init_plot, finish_plot


class Vapor_plot(Vapor):

    def plot(self, mode):
        """Plot p,T diagram for a compound."""
        init_plot(mode)

        plt.plot(self.T_tab - cfg.C2K, self.p_tab, '-k')
        plt.title(self.get_title())
        plt.xlabel('T [°C]')
        plt.ylabel('p [kPa]')

        return finish_plot(mode)
