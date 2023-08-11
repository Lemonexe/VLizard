import numpy as np
from scipy.optimize import root
from scipy.interpolate import UnivariateSpline
from src.config import x_points_smooth_plot, T_boil_tol
from src.utils.errors import AppException


# create a Tabulation object, takes a VLE dataset instance, a Model instance and its parameters
# bears tabulated isobaric x, y, gamma, T (at pressure mean)
class Tabulate:

    def __init__(self, vle, model, params):
        self.p_mean = p_mean = np.mean(vle.p)
        self.x_1 = np.linspace(0, 1, x_points_smooth_plot)

        self.T = np.zeros(x_points_smooth_plot)
        self.y_1 = np.zeros(x_points_smooth_plot)
        self.y_2 = np.zeros(x_points_smooth_plot)
        self.gamma_1 = np.zeros(x_points_smooth_plot)
        self.gamma_2 = np.zeros(x_points_smooth_plot)

        T_spline = UnivariateSpline(vle.x_1, vle.T)  # use measured data to estimate boiling temperature

        # for each point in VLE dataset, find T that satisfies p = p_1 + p_2 and calculate y_1, y_2
        for i, x_1i in enumerate(self.x_1):
            # pylint: disable=cell-var-from-loop
            x_2i = 1 - x_1i

            # when gamma model is dependent on T, always calculate gamma together with T
            if model.is_gamma_T_fun:
                get_gamma_12 = lambda T: model.fun(x_1i, T, *params)
            # optimization: when gamma model is independent on T, calculate gamma once and return the cached value
            else:
                gamma_12_const = model.fun(x_1i, 0, *params)  # pass 0 as temperature since it doesn't matter
                get_gamma_12 = lambda T: gamma_12_const

            # partial pressures as per Raoult's Law
            p_1i = lambda gamma_1, T: x_1i * gamma_1 * vle.antoine_fun_1(T)
            p_2i = lambda gamma_2, T: x_2i * gamma_2 * vle.antoine_fun_2(T)

            # resid of equation to solve for T: p_1i + p_2i = p
            def resid(T):
                gamma_1, gamma_2 = get_gamma_12(T)
                return p_1i(gamma_1, T) + p_2i(gamma_2, T) - p_mean

            T_est = T_spline(x_1i)
            sol = root(fun=resid, x0=T_est, tol=T_boil_tol)
            if not sol.success: raise AppException(f'Error while tabulating model – could not find T for x_1 = {x_1i}')
            self.T[i] = T_i = sol.x

            gamma_1_final, gamma_2_final = get_gamma_12(T_i)

            self.gamma_1[i] = gamma_1_final
            self.gamma_2[i] = gamma_2_final
            self.y_1[i] = x_1i * gamma_1_final * vle.antoine_fun_1(T_i) / p_mean
            self.y_2[i] = 1 - self.y_1[i]