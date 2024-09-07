from matplotlib import pyplot as plt
from src.config import cfg
from src.utils.UoM import convert_T, convert_p
from src.fit.Fit_Vapor import Fit_Vapor
from src.plot.plot_io import init_plot, finish_plot


class Fit_Vapor_plot(Fit_Vapor):

    def draw_data(self):
        T_data_disp = convert_T(self.T_data)
        p_data_disp = convert_p(self.p_data)
        plt.plot(T_data_disp, p_data_disp, 'Dk', label='data')

    def decorate(self):
        plt.title(self.get_title())
        plt.xlabel(f'T [{cfg.UoM_T}]')
        plt.ylabel(f'p [{cfg.UoM_p}]')
        plt.legend()

    def plot_p(self, mode):
        """Overlay p-fitted model over vapor pressure data."""
        if not self.is_optimized: return None
        init_plot(mode)
        self.draw_data()

        T_tab_disp = convert_T(self.T_tab)
        p_tab_inter_disp = convert_p(self.p_tab_inter)
        plt.plot(T_tab_disp, p_tab_inter_disp, '-k', label='p-fitted model')

        self.decorate()
        return finish_plot(mode)

    def plot_T_p(self, mode):
        """Overlay T,p-fitted model over vapor pressure data."""
        if not self.is_T_p_optimized: return None
        init_plot(mode)
        self.draw_data()

        T_tab_disp = convert_T(self.T_tab)
        p_tab_final_disp = convert_p(self.p_tab_final)
        plt.plot(T_tab_disp, p_tab_final_disp, '-k', label='T,p-fitted model')

        self.decorate()
        return finish_plot(mode)
