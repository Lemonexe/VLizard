import numpy as np
from matplotlib import pyplot as plt
from src.utils.get_antoine import get_antoine_and_warn


# unpack the basic necessary data into this object rich with derived physical quantities + metadata
class VLE:
    warnings = []

    def __init__(self, table, compound1, compound2):
        (self.p, self.T, self.x_1, self.y_1) = table.T
        self.n = len(self.x_1)
        self.x_2 = 1 - self.x_1
        self.y_2 = 1 - self.y_1

        (antoine_fun_1, warnings) = get_antoine_and_warn(compound1, np.min(self.T), np.max(self.T))
        self.warnings.extend(warnings)
        (antoine_fun_2, warnings) = get_antoine_and_warn(compound2, np.min(self.T), np.max(self.T))
        self.warnings.extend(warnings)
        self.antoine_fun_1 = antoine_fun_1
        self.antoine_fun_2 = antoine_fun_2

        self.ps_1 = antoine_fun_1(self.T)
        self.ps_2 = antoine_fun_2(self.T)

        self.gamma_1 = self.y_1 * self.p / self.x_1 / self.ps_1
        self.gamma_2 = self.y_2 * self.p / self.x_2 / self.ps_2

    def plot_xy(self):
        plt.plot(self.x_1, self.y_1, 'ok')
        plt.plot([0, 1], [0, 1], ':k')
        plt.xlim(0, 1)
        plt.ylim(0, 1)
        plt.xlabel('x')
        plt.ylabel('y')
        plt.legend()

    def plot_Txy(self):
        plt.plot(self.x_1, self.T, 'ok')
        plt.plot(self.y_1, self.T, 'Dk')
        plt.xlim(0, 1)
        plt.xlabel('x, y')
        plt.ylabel('T')
        plt.legend()

    def plot_gamma(self):
        plt.plot(self.x_1, self.gamma_1, '^b', label='$\\gamma_1$')
        plt.plot(self.x_1, self.gamma_2, 'vr', label='$\\gamma_2$')
        plt.axhline(y=1, color='k', linestyle=':')
        plt.xlim(0, 1)
        plt.xlabel('$x_1$')
        plt.ylabel('$\\gamma$')
        plt.legend()
