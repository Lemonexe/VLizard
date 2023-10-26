from matplotlib import pyplot as plt
from src.TD.VLE import VLE


class VLE_plot(VLE):

    def plot_xy(self, silent=False):
        """Plot x,y diagram."""
        plt.figure()
        plt.plot(self.x_1, self.y_1, 'Dk', label='data')
        plt.plot([0, 1], [0, 1], ':k')
        plt.xlim(0, 1)
        plt.ylim(0, 1)
        plt.title(f'xy diagram for {self.get_title()}')
        plt.xlabel('x')
        plt.ylabel('y')
        if silent: return
        plt.ion()
        plt.show()

    def plot_Txy(self, silent=False):
        """Plot T,x,y diagram."""
        plt.figure()
        plt.plot(self.y_1, self.T, 'Dr', label='dew')
        plt.plot(self.x_1, self.T, 'Db', label='boil')
        plt.xlim(0, 1)
        plt.title(f'Txy diagram for {self.get_title()}')
        plt.xlabel('x, y')
        plt.ylabel('T [K]')
        plt.legend()
        if silent: return
        plt.ion()
        plt.show()

    def plot_gamma(self, silent=False):
        """Plot diagram of activity coeffs per x."""
        plt.figure()
        plt.plot(self.x_1, self.gamma_1, '^r', label='$\\gamma_1$')
        plt.plot(self.x_1, self.gamma_2, 'vb', label='$\\gamma_2$')

        plt.axhline(y=1, color='k', linestyle=':')
        plt.xlim(0, 1)
        plt.title(f'Activity coefficients for {self.get_title()}')
        plt.xlabel('$x_1$')
        plt.ylabel('$\\gamma$')
        plt.legend()
        if silent: return
        plt.ion()
        plt.show()
