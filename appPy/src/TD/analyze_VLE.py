import numpy as np
from matplotlib import pyplot as plt
from src.utils.get_antoine import get_antoine_and_warn


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

        self.ps_1 = antoine_fun_1(self.T)
        self.ps_2 = antoine_fun_2(self.T)

        self.gamma_1 = self.y_1 * self.p / self.x_1 / self.ps_1
        self.gamma_2 = self.y_2 * self.p / self.x_2 / self.ps_2

    def plot_gamma(self):
        plt.plot(self.x_1, self.gamma_1, 'ob')
        plt.plot(self.x_1, self.gamma_2, 'or')
        plt.axhline(y=1, color='k', linestyle=':')
