import numpy as np
from src.utils.io.echo import echo, underline_echo
from src.utils.vector import serialize_cols
from src.utils.io.tsv import matrix2tsv
from src.utils.math.diff_noneq import diffs_noneq_3
from .VLE import VLE


class Slope_test(VLE):

    def __init__(self, compound1, compound2, dataset_name):
        """
        Perform simple point-to-point slope test as object with results and methods for reporting & visualization.

        compound1, compound2 (str): names of compounds
        dataset_name (str): name of dataset
        """
        super().__init__(compound1, compound2, dataset_name)
        self.keys_to_serialize = ['x_1', 'd_ln_gamma_1', 'd_ln_gamma_2', 'P2P_res', 'P2P_res_avg']
        gamma_1, gamma_2, x_1, x_2 = self.gamma_1, self.gamma_2, self.x_1, self.x_2

        # serialize the two gamma vectors below each other (as matrix of two rows)
        ln_gamma_12 = np.array([np.log(gamma_1), np.log(gamma_2)])

        # calculate d gamma / d x using three-point non-equidistant formula (same shape as ln_gamma_12)
        d_ln_gamma_1, d_ln_gamma_2 = diffs_noneq_3(x_1, ln_gamma_12)
        self.d_ln_gamma_1, self.d_ln_gamma_2 = d_ln_gamma_1, d_ln_gamma_2

        # point-to-point residue of Gibbs-Duhem equation as vector
        self.P2P_res = x_1*d_ln_gamma_1 + x_2*d_ln_gamma_2

        # the only summary characteristic of this test, it's not much, but it's honest work
        self.P2P_res_avg = np.mean(abs(self.P2P_res))

    def get_title(self):
        return f'Slope test for {super().get_title()}'

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        # pretty-print a table of following vectors
        headlines = ['x1', 'dln γ1', 'dln γ2', 'residual']
        table = serialize_cols(self.x_1, self.d_ln_gamma_1, self.d_ln_gamma_2, self.P2P_res)
        echo(matrix2tsv(table, headlines=headlines, format_spec='{:6.3f}'))

        echo(f'\nMean abs residual = {self.P2P_res_avg:.3f}')
        echo('')
