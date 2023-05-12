import numpy as np
from matplotlib import pyplot as plt
from .Antoine import Antoine
from src.utils.Result import Result
from src.utils.get_VLE_data import get_VLE_table


# unpack the basic necessary data into this object rich with derived physical quantities + metadata
class VLE(Result):

    def __init__(self, compound1, compound2, dataset_name):
        super().__init__()
        self.compound1 = compound1
        self.compound2 = compound2
        self.dataset_name = dataset_name

        try:
            table = get_VLE_table(compound1, compound2, dataset_name)
        except ValueError as err:
            self.err(str(err))
            return

        (self.p, self.T, self.x_1, self.y_1) = table.T
        self.x_2 = 1 - self.x_1
        self.y_2 = 1 - self.y_1

        antoine_1 = Antoine(compound1)
        antoine_2 = Antoine(compound2)
        self.merge_status(antoine_1, antoine_2)
        if self.status == 2:
            return
        antoine_1.check_T_bounds(np.min(self.T), np.max(self.T))
        antoine_2.check_T_bounds(np.min(self.T), np.max(self.T))
        self.merge_status(antoine_1, antoine_2)
        self.antoine_fun_1 = antoine_1.antoine_fun
        self.antoine_fun_2 = antoine_2.antoine_fun

        self.ps_1 = self.antoine_fun_1(self.T)
        self.ps_2 = self.antoine_fun_2(self.T)

        self.gamma_1 = self.y_1 * self.p / self.x_1 / self.ps_1
        self.gamma_2 = self.y_2 * self.p / self.x_2 / self.ps_2

    def get_title(self):
        return f'{self.compound1}-{self.compound2}, {self.dataset_name}'

    def plot_xy(self):
        plt.plot(self.x_1, self.y_1, 'ok')
        plt.plot([0, 1], [0, 1], ':k')
        plt.xlim(0, 1)
        plt.ylim(0, 1)
        plt.title(f'xy diagram for {self.get_title()}')
        plt.xlabel('x')
        plt.ylabel('y')

    def plot_Txy(self):
        plt.plot(self.x_1, self.T, 'ok')
        plt.plot(self.y_1, self.T, 'Dk')
        plt.xlim(0, 1)
        plt.title(f'Txy diagram for {self.get_title()}')
        plt.xlabel('x, y')
        plt.ylabel('T')

    def plot_gamma(self):
        plt.plot(self.x_1, self.gamma_1, '^b', label='$\\gamma_1$')
        plt.plot(self.x_1, self.gamma_2, 'vr', label='$\\gamma_2$')
        plt.axhline(y=1, color='k', linestyle=':')
        plt.xlim(0, 1)
        plt.title(f'Activity coefficients for {self.get_title()}')
        plt.xlabel('$x_1$')
        plt.ylabel('$\\gamma$')
        plt.legend()