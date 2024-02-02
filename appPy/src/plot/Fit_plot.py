from matplotlib import pyplot as plt
from src.fit.Fit import Fit
from .VLE_plot import VLE_plot
from src.plot.plot_io import init_plot, finish_plot


class Fit_plot(Fit):

    def __init__(self, *params):
        super().__init__(*params)
        self.dataset_VLEs = [VLE_plot(vle.compound1, vle.compound2, vle.dataset_name) for vle in self.dataset_VLEs]

    def plot_xy_model(self, mode):
        """Overlay fitted xy curve over VLE data."""
        plots = []
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            init_plot(mode)
            vle.plot_xy(mode=None)
            plt.plot(tab.x_1, tab.y_1, '-k', label=self.model.display_name)
            plt.legend()
            plots.append(finish_plot(mode))
        return plots if mode == 'svg' else None

    def plot_Txy_model(self, mode):
        """Overlay fitted Txy curve over VLE data."""
        plots = []
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            init_plot(mode)
            vle.plot_Txy(mode=None)
            plt.plot(tab.y_1, tab.T, '-r', label=f'dew {self.model.display_name}')
            plt.plot(tab.x_1, tab.T, '-b', label=f'boil {self.model.display_name}')
            plt.legend()
            plots.append(finish_plot(mode))
        return plots if mode == 'svg' else None

    def plot_gamma_model(self, mode):
        """Overlay fitted gamma curve over VLE data."""
        plots = []
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            init_plot(mode)
            vle.plot_gamma(mode=None)
            plt.plot(tab.x_1, tab.gamma_1, '-r', label=f'$\\gamma_1$ {self.model.display_name}')
            plt.plot(tab.x_1, tab.gamma_2, '-b', label=f'$\\gamma_2$ {self.model.display_name}')
            plt.legend()
            plots.append(finish_plot(mode))
        return plots if mode == 'svg' else None
