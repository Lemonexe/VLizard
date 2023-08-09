import numpy as np
from scipy.optimize import root
from scipy.interpolate import UnivariateSpline
from src.config import x_points_smooth_plot, T_boil_tol
from src.utils.errors import AppException


# create a Tabulation object, takes a VLE dataset instance, a model function and its parameters
# bears tabulated isobaric x, y, gamma, T (at pressure mean)
class Tabulate:

    def __init__(self, vle, model_fun, params, is_T_const):
        self.vle = vle
        self.model_fun = model_fun
        self.params = params

        self.p_mean = np.mean(vle.p)
        self.x_1 = np.linspace(0, 1, x_points_smooth_plot)

        self.T = np.zeros(x_points_smooth_plot)
        self.y_1 = np.zeros(x_points_smooth_plot)
        self.y_2 = np.zeros(x_points_smooth_plot)
        self.gamma_1 = np.zeros(x_points_smooth_plot)
        self.gamma_2 = np.zeros(x_points_smooth_plot)

        if is_T_const: self.tabulate_const_gamma()
        else: self.tabulate_variable_gamma()

    # simpler case: when gamma is independent on T, tabulate gamma and work with it as constant
    def tabulate_const_gamma(self):
        vle, model_fun, params, p_mean = self.vle, self.model_fun, self.params, self.p_mean
        gamma_M = model_fun(self.x_1, self.T, *params)  # the passed T is unused (we are passing zeros)
        gamma_1 = gamma_M[0, :]
        gamma_2 = gamma_M[1, :]
        self.gamma_1 = gamma_1
        self.gamma_2 = gamma_2

        T_spline = UnivariateSpline(vle.x_1, self.vle.T)

        nfev = 0
        # for each point in VLE dataset, find T that satisfies p = p_1 + p_2 and calculate y_1, y_2
        for i, (x_1i, gamma_1i, gamma_2i) in enumerate(zip(self.x_1, gamma_1, gamma_2)):
            x_2i = 1 - x_1i

            # sum of both partial pressures must be equal to total pressure
            # pylint: disable=cell-var-from-loop
            resid = lambda T: x_1i * gamma_1i * vle.antoine_fun_1(T) + x_2i * gamma_2i * vle.antoine_fun_2(T) - p_mean

            T_est = T_spline(x_1i)  # estimate boiling point by interpolating measured data

            sol = root(fun=resid, x0=T_est, tol=T_boil_tol)
            if not sol.success: raise AppException(f'Error while tabulating model – could not find T for x_1 = {x_1i}')
            T_i = sol.x

            self.T[i] = T_i
            self.y_1[i] = x_1i * gamma_1i * vle.antoine_fun_1(T_i) / p_mean
            self.y_2[i] = 1 - self.y_1[i]
            nfev += sol.nfev
        print(f'n: {nfev}')

    # TODO actully unite these functions, just with different gamma_fun!!
    # more complex case: when gamma is dependent on T, calculate gamma together with T
    def tabulate_variable_gamma(self):
        # vle, model_fun, params = self.vle, self.model_fun, self.params
        print('Not implemented yet')
