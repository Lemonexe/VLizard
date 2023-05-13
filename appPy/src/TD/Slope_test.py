import numpy as np
from matplotlib import pyplot as plt
from .VLE import VLE
from src.utils.Result import Result
from src.utils.math.diff_noneq import diffs_noneq_3


# perform simple point to point slope test as object with results, and methods for visualization
class Slope_test(Result):

    def __init__(self, compound1, compound2, dataset_name):
        super().__init__()
        self.compound1 = compound1
        self.compound2 = compound2
        self.dataset_name = dataset_name

        vle = VLE(compound1, compound2, dataset_name)
        self.vle = vle
        self.merge_status(vle)
        if self.status == 2:
            return

        x_vec = vle.x_1
        y_vec = np.array([np.log(vle.gamma_1), np.log(vle.gamma_2)])
        d_gamma = diffs_noneq_3(x_vec, y_vec)

        self.d_ln_gamma_1 = d_gamma[0, :]
        self.d_ln_gamma_2 = d_gamma[1, :]

        self.P2P_resid = vle.x_1 * self.d_ln_gamma_1 + vle.x_2 * self.d_ln_gamma_2

    def __str__(self):
        x = self.vle.x_1[:, np.newaxis]
        R = self.P2P_resid[:, np.newaxis]
        xR_table = np.concatenate((x, R), axis=1)
        printed = np.array_str(xR_table, precision=3, suppress_small=True)
        return f'residuals:\n{printed}\naverage resid:' + '{:.2e}'.format(np.mean(abs(R)))

    def plot_slope(self):
        x_1 = self.vle.x_1
        plt.plot(x_1, self.d_ln_gamma_1, '^b', label='$d$ln$\\gamma_1$')
        plt.plot(x_1, self.d_ln_gamma_2, 'vr', label='$d$ln$\\gamma_2$')
        plt.plot(x_1, self.P2P_resid, 'sk', label='residual')
        plt.axhline(y=0, color='k', linestyle=':')
        plt.title(f'Slope test for {self.vle.get_title()}')
        plt.xlim(0, 1)
        plt.xlabel('$x_1$')
        plt.ylabel('$d$ln$\\gamma$')
        plt.legend()
