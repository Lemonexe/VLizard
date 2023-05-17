import numpy as np
from matplotlib import pyplot as plt
from src.utils.underline import underline
from src.utils.array2tsv import array2tsv, vecs2cols
from src.utils.math.diff_noneq import diffs_noneq_3
from .VLE import VLE


# perform simple point-to-point slope test as object with results, and methods for visualization
class Slope_test(VLE):

    def __init__(self, compound1, compound2, dataset_name):
        super().__init__(compound1, compound2, dataset_name)

        # serialize the two gamma vectors below each other (as matrix of two rows)
        gamma_12 = np.array([np.log(self.gamma_1), np.log(self.gamma_2)])

        # calculate d gamma / d x using three-point non-equidistant formula (same shape as gamma_12)
        d_gamma = diffs_noneq_3(self.x_1, gamma_12)

        self.d_ln_gamma_1 = d_gamma[0, :]
        self.d_ln_gamma_2 = d_gamma[1, :]

        # point-to-point residue of Gibbs-Duhem equation as vector
        self.P2P_resid = self.x_1 * self.d_ln_gamma_1 + self.x_2 * self.d_ln_gamma_2

    def get_title(self):
        return f'Slope test for {super().get_title()}'

    def report(self):
        print(underline(self.get_title()))
        self.report_warnings()

        # pretty-print a table of following vectors
        headlines = ['  x1', 'dln γ1', 'dln γ2', 'residual']
        table = vecs2cols(self.x_1, self.d_ln_gamma_1, self.d_ln_gamma_2, self.P2P_resid)
        print(array2tsv(table, headlines=headlines, format_spec='{:6.3f}'))

        avgR = np.mean(abs(self.P2P_resid))  # summary characteristic
        print(f'\nMean abs residual = {avgR:.3f}')
        print('')

    def plot(self):
        x_1 = self.x_1
        plt.plot(x_1, self.d_ln_gamma_1, '^b', label='$d$ln$\\gamma_1$')
        plt.plot(x_1, self.d_ln_gamma_2, 'vr', label='$d$ln$\\gamma_2$')
        plt.plot(x_1, self.P2P_resid, 'sk', label='residual')
        plt.axhline(y=0, color='k', linestyle=':')
        plt.title(self.get_title())
        plt.xlim(0, 1)
        plt.xlabel('$x_1$')
        plt.ylabel('$d$ln$\\gamma$')
        plt.legend()
