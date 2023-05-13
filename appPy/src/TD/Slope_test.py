import numpy as np
from matplotlib import pyplot as plt
from .VLE import VLE
from src.utils.Result import Result
from src.utils.math.diff_noneq import diffs_noneq_3
from src.utils.array2tsv import array2tsv, vecs2cols


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

        # point to point residue of Gibbs-Duhem equation (vector)
        self.P2P_resid = vle.x_1 * self.d_ln_gamma_1 + vle.x_2 * self.d_ln_gamma_2

    def report(self):
        print('')
        headlines = ['  x1', 'dln γ1', 'dln γ2', 'residual']
        table = vecs2cols(self.vle.x_1, self.d_ln_gamma_1, self.d_ln_gamma_2, self.P2P_resid)
        print(array2tsv(table, headlines=headlines, format_spec='{:6.3f}'))
        avgR = '{:.3f}'.format(np.mean(abs(self.P2P_resid)))
        print(f'\naverage abs resid: {avgR}')

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
