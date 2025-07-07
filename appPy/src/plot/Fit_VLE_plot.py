from matplotlib import pyplot as plt
from src.utils.UoM import convert_p, convert_T
from src.fit.Fit_VLE import Fit_VLE
from .VLE_plot import VLE_plot
from src.plot.plot_io import init_plot, finish_plot
from src.utils.errors import AppException


class Fit_VLE_plot(Fit_VLE):

    def __init__(self, *args):
        super().__init__(*args)
        self.dataset_VLEs = [VLE_plot(vle.compound1, vle.compound2, vle.dataset_name) for vle in self.dataset_VLEs]

    def __check_is_tabulated(self):
        if self.tabulated_datasets is None:
            raise AppException('No tabulated data to plot, must call tabulate() first!')

    def plot_xy_model(self, mode):
        """Overlay fitted xy curve over VLE data."""
        self.__check_is_tabulated()
        plots = []
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            init_plot(mode)
            vle.plot_xy(mode=None)
            plt.plot(tab.x_1, tab.y_1, '-k', label=self.model.display_name)
            plt.legend()
            plots.append(finish_plot(mode))
        return plots if mode == 'svg' else None

    def plot_Txy_model(self, mode):
        """Overlay fitted Txy curve over VLE data if isobaric, else do nothing."""
        self.__check_is_tabulated()
        plots = []
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            if vle.is_isobaric != True:
                plots.append(None)
                continue
            init_plot(mode)
            vle.plot_Txy(mode=None)
            T_disp = convert_T(tab.T)
            plt.plot(tab.y_1, T_disp, '-r', label=f'dew {self.model.display_name}')
            plt.plot(tab.x_1, T_disp, '-b', label=f'boil {self.model.display_name}')
            plt.legend()
            plots.append(finish_plot(mode))
        return plots if mode == 'svg' else None

    def plot_pxy_model(self, mode):
        """Overlay fitted pxy curve over VLE data if isothermal, else do nothing."""
        self.__check_is_tabulated()
        plots = []
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            if vle.is_isobaric != False:
                plots.append(None)
                continue
            init_plot(mode)
            vle.plot_pxy(mode=None)
            p_disp = convert_p(tab.p)
            plt.plot(tab.x_1, p_disp, '-b', label=f'boil {self.model.display_name}')
            plt.plot(tab.y_1, p_disp, '-r', label=f'dew {self.model.display_name}')
            plt.legend()
            plots.append(finish_plot(mode))
        return plots if mode == 'svg' else None

    def plot_gamma_model(self, mode):
        """Overlay fitted gamma curve over VLE data."""
        self.__check_is_tabulated()
        plots = []
        for (vle, tab) in zip(self.dataset_VLEs, self.tabulated_datasets):
            init_plot(mode)
            vle.plot_gamma(mode=None)
            plt.plot(tab.x_1, tab.gamma_1, '-r', label=f'$\\gamma_1$ {self.model.display_name}')
            plt.plot(tab.x_1, tab.gamma_2, '-b', label=f'$\\gamma_2$ {self.model.display_name}')
            plt.legend()
            plots.append(finish_plot(mode))
        return plots if mode == 'svg' else None
