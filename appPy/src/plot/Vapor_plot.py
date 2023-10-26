from matplotlib import pyplot as plt
from src.config import C2K
from src.TD.Vapor import Vapor


class Vapor_plot(Vapor):

    def plot(self):
        plt.figure()
        plt.plot(self.T_tab - C2K, self.p_tab, '-k')
        plt.title(self.get_title())
        plt.xlabel('T [°C]')
        plt.ylabel('p [kPa]')
        plt.ion()
        plt.show()
