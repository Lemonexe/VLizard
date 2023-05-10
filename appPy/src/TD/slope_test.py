import numpy as np
from matplotlib import pyplot as plt
from src.TD.analyze_VLE import VLE
from src.utils.math.diff_noneq import diffs_noneq


# perform simple point to point slope test as object with results, and methods for visualization
class Slope_test:

    def __init__(self, table, compound1, compound2):
        vle = VLE(table, compound1, compound2)
        self.vle = vle

        self.d_ln_gamma = diffs_noneq(vle.x_1, np.array([vle.gamma_1, vle.gamma_2]), vle.x_1)
        d_ln_gamma_1 = self.d_ln_gamma[0, :]
        d_ln_gamma_2 = self.d_ln_gamma[1, :]

        self.P2P_resid = vle.x_1 * d_ln_gamma_1 + vle.x_2 * d_ln_gamma_2

    def __str__(self):
        x = self.vle.x_1[:, np.newaxis]
        R = self.P2P_resid[:, np.newaxis]
        table = np.concatenate((x, R), axis=1)
        printed = np.array_str(table, precision=3, suppress_small=True)
        return f'residuals:\n{printed}'

    def plot_gamma(self):
        self.vle.plot_gamma()

    def plot_slope(self):
        x_1 = self.vle.x_1
        d_ln_gamma_1 = self.d_ln_gamma[0, :]
        d_ln_gamma_2 = self.d_ln_gamma[1, :]
        plt.plot(x_1, d_ln_gamma_1, '^b', label='$d$ln$\\gamma_1$')
        plt.plot(x_1, d_ln_gamma_2, 'vr', label='$d$ln$\\gamma_2$')
        plt.plot(x_1, self.P2P_resid, 'sk', label='residual')
        plt.axhline(y=0, color='k', linestyle=':')
        plt.xlim(0, 1)
        plt.xlabel('$x_1$')
        plt.ylabel('$d$ln$\\gamma$')
        plt.legend()
