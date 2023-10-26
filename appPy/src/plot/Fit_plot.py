from matplotlib import pyplot as plt
from src.fit.Fit import Fit
from .VLE_plot import VLE_plot


class Fit_plot(Fit):

    def __init__(self, *params):
        super().__init__(*params)
        self.dataset_VLEs = [VLE_plot(vle.compound1, vle.compound2, vle.dataset_name) for vle in self.dataset_VLEs]

    def plot_xy_model(self):
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            vle.plot_xy(silent=True)
            plt.plot(tab.x_1, tab.y_1, '-k', label=self.model.display_name)
            plt.legend()
            plt.ion()
            plt.show()

    def plot_Txy_model(self):
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            vle.plot_Txy(silent=True)
            plt.plot(tab.y_1, tab.T, '-r', label=f'dew {self.model.display_name}')
            plt.plot(tab.x_1, tab.T, '-b', label=f'boil {self.model.display_name}')
            plt.legend()
            plt.ion()
            plt.show()

    def plot_gamma_model(self):
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            vle.plot_gamma(silent=True)
            plt.plot(tab.x_1, tab.gamma_1, '-r', label=f'$\\gamma_1$ {self.model.display_name}')
            plt.plot(tab.x_1, tab.gamma_2, '-b', label=f'$\\gamma_2$ {self.model.display_name}')
            plt.legend()
            plt.ion()
            plt.show()
