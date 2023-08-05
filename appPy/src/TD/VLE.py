import numpy as np
from matplotlib import pyplot as plt
from src.utils.echo import echo, underline_echo
from src.utils.array import serialize_cols
from src.utils.tsv import array2tsv
from src.utils.Result import Result
from src.utils.get_VLE_data import get_VLE_table
from .Antoine import Antoine


# for a given dataset of a given system, unpack the basic necessary data into object with derived physical quantities + metadata
class VLE(Result):

    def __init__(self, compound1, compound2, dataset_name):
        super().__init__()
        self.compound1 = compound1
        self.compound2 = compound2
        self.dataset_name = dataset_name

        table = get_VLE_table(compound1, compound2, dataset_name)

        (self.p, self.T, self.x_1, self.y_1) = table.T
        self.x_2 = 1 - self.x_1
        self.y_2 = 1 - self.y_1

        antoine_1 = Antoine(compound1)
        antoine_2 = Antoine(compound2)
        T_data_bounds = (np.min(self.T), np.max(self.T))
        antoine_1.check_T_bounds(*T_data_bounds)
        antoine_2.check_T_bounds(*T_data_bounds)
        self.merge_status(antoine_1, antoine_2)
        self.antoine_fun_1 = antoine_1.antoine_fun
        self.antoine_fun_2 = antoine_2.antoine_fun

        self.ps_1 = self.antoine_fun_1(self.T)
        self.ps_2 = self.antoine_fun_2(self.T)

        self.gamma_1 = self.y_1 * self.p / self.x_1 / self.ps_1
        self.gamma_2 = self.y_2 * self.p / self.x_2 / self.ps_2

    def report(self):
        underline_echo(f'Activity coeffs for {self.get_title()}')
        self.report_warnings()

        # pretty-print a table of following vectors
        headlines = ['  x1', 'γ1', 'γ2']
        table = serialize_cols(self.x_1, self.gamma_1, self.gamma_2)
        echo(array2tsv(table, headlines=headlines, format_spec='{:6.3f}'))
        echo('')

    def get_title(self):
        return f'{self.compound1}-{self.compound2}, {self.dataset_name}'

    # plot x,y diagram
    def plot_xy(self, silent=False):
        plt.figure()
        plt.plot(self.x_1, self.y_1, 'Dk')
        plt.plot([0, 1], [0, 1], ':k')
        plt.xlim(0, 1)
        plt.ylim(0, 1)
        plt.title(f'xy diagram for {self.get_title()}')
        plt.xlabel('x')
        plt.ylabel('y')
        if silent: return
        plt.ion()
        plt.show()

    # plot T,x,y diagram
    def plot_Txy(self, silent=False):
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

    # plot diagram of activity coeffs per x
    def plot_gamma(self, silent=False):
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
