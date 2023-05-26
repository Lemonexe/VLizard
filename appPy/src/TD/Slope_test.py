import click
import numpy as np
from matplotlib import pyplot as plt
from src.utils.underline import underline
from src.utils.array2tsv import array2tsv, vecs2cols
from src.utils.math.diff_noneq import diffs_noneq_3
from .VLE import VLE


# perform simple point-to-point slope test as object with results and methods for reporting & visualization
class Slope_test(VLE):

    def __init__(self, compound1, compound2, dataset_name):
        super().__init__(compound1, compound2, dataset_name)
        gamma_1, gamma_2, x_1, x_2 = self.gamma_1, self.gamma_2, self.x_1, self.x_2

        # serialize the two gamma vectors below each other (as matrix of two rows)
        ln_gamma_12 = np.array([np.log(gamma_1), np.log(gamma_2)])

        # calculate d gamma / d x using three-point non-equidistant formula (same shape as ln_gamma_12)
        d_ln_gamma_12 = diffs_noneq_3(x_1, ln_gamma_12)

        d_ln_gamma_1 = d_ln_gamma_12[0, :]
        d_ln_gamma_2 = d_ln_gamma_12[1, :]
        self.d_ln_gamma_1, self.d_ln_gamma_2 = d_ln_gamma_1, d_ln_gamma_2

        # point-to-point residue of Gibbs-Duhem equation as vector
        self.P2P_res = x_1*d_ln_gamma_1 + x_2*d_ln_gamma_2

    def get_title(self):
        return f'Slope test for {super().get_title()}'

    def report(self):
        click.echo(underline(self.get_title()))
        self.report_warnings()

        # pretty-print a table of following vectors
        headlines = ['  x1', 'dln γ1', 'dln γ2', 'residual']
        table = vecs2cols(self.x_1, self.d_ln_gamma_1, self.d_ln_gamma_2, self.P2P_res)
        click.echo(array2tsv(table, headlines=headlines, format_spec='{:6.3f}'))

        avgR = np.mean(abs(self.P2P_res))  # summary characteristic
        click.echo(f'\nMean abs residual = {avgR:.3f}')
        click.echo('')

    def plot(self):
        x_1 = self.x_1
        plt.plot(x_1, self.d_ln_gamma_1, '^r', label='$d$ln$\\gamma_1$')
        plt.plot(x_1, self.d_ln_gamma_2, 'vb', label='$d$ln$\\gamma_2$')
        plt.plot(x_1, self.P2P_res, 'Dk', label='residual')
        plt.axhline(y=0, color='k', linestyle=':')
        plt.title(self.get_title())
        plt.xlim(0, 1)
        plt.xlabel('$x_1$')
        plt.ylabel('$d$ln$\\gamma$')
        plt.legend()
