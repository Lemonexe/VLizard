from matplotlib import pyplot as plt
from src.config import cfg
from src.utils.UoM import convert_T, convert_p
from src.fit.Fit_Vapor import Fit_Vapor
from src.plot.plot_io import init_plot, finish_plot
from src.utils.errors import AppException

class Fit_Vapor_plot(Fit_Vapor):

    def __check_is_tabulated(self):
        if self.T_tab is None or self.p_tab_final is None:
            raise AppException('No tabulated data to plot, must call tabulate() first!')

    def plot(self, mode):
        """Overlay fitted model over vapor pressure data."""
        self.__check_is_tabulated()
        init_plot(mode)

        T_data_disp = convert_T(self.T_data)
        p_data_disp = convert_p(self.p_data)

        T_tab_disp = convert_T(self.T_tab)
        p_tab_inter_disp = convert_p(self.p_tab_inter)
        p_tab_final_disp = convert_p(self.p_tab_final)

        plt.plot(T_data_disp, p_data_disp, 'Dk', label='data')
        plt.plot(T_tab_disp, p_tab_inter_disp, ':k', label='p-fitted model')
        plt.plot(T_tab_disp, p_tab_final_disp, '-k', label='T,p-fitted model')
        plt.title(self.get_title())
        plt.xlabel(f'T [{cfg.UoM_T}]')
        plt.ylabel(f'p [{cfg.UoM_p}]')

        plt.legend()
        return finish_plot(mode)
