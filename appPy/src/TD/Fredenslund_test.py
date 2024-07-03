import numpy as np
from scipy.optimize import curve_fit
from src.utils.io.echo import echo, ok_echo, err_echo, underline_echo
from src.utils.errors import AppException
from src.utils.math.legendre import get_g_E_poly, get_d_g_E_poly, get_ordered_array_fun
from src.config import cfg, cst
from .VLE import VLE


class Fredenslund_test(VLE):

    def __init__(self, compound1, compound2, dataset_name, legendre_order):
        """
        Perform Fredenslund test as object with results and methods for reporting & visualization.

        compound1, compound2 (str): names of compounds
        dataset_name (str): name of dataset
        legendre_order (int): order of Legendre polynomial to use, must be 3, 4 or 5, default 4
        """
        super().__init__(compound1, compound2, dataset_name)
        self.keys_to_serialize = ['is_consistent', 'p_res_avg', 'y_1_res_avg', 'y_2_res_avg', 'legendre_order']
        x_1, gamma_1, x_2, gamma_2 = self.x_1, self.gamma_1, self.x_2, self.gamma_2
        p, ps_1, ps_2, y_1, y_2 = self.p, self.ps_1, self.ps_2, self.y_1, self.y_2

        if legendre_order is None: legendre_order = cfg.default_legendre_order
        elif legendre_order not in [3, 4, 5]:
            raise AppException(f'Legendre polynomial must be of order 3, 4, 5, got {legendre_order}')
        self.legendre_order = legendre_order

        # number of model params must be greater than number of points
        n_x = len(x_1)
        n_x_min = legendre_order + 2
        if n_x < n_x_min:
            raise AppException(
                f'Legendre polynomial of order {legendre_order} requires at least {n_x_min} points, got {n_x}')

        # note: g_E means dimensionless excess molar Gibbs energy (g_E = G_mE / RT)

        # g_E vector from experimental values
        g_E_exp = (x_1 * np.log(gamma_1) + x_2 * np.log(gamma_2))

        # parametrized model function to calculate g_E using linear combination of Legendre polynomials * params
        legendre_array_fun = get_ordered_array_fun(legendre_order, get_g_E_poly)
        g_E_fun = lambda x, *params: np.sum(params * legendre_array_fun(x).T, 1)

        # perform non-lin regression to get the multiplying parameters
        params0 = np.ones(legendre_order + 1, dtype='float64')
        params, *_rest = curve_fit(g_E_fun, x_1, g_E_exp, p0=params0)

        # g_E vector from Legendre model
        g_E_cal = g_E_fun(x_1, *params)

        # d(g_E)/dx vector from Legendre model
        legendre_d_array_fun = get_ordered_array_fun(legendre_order, get_d_g_E_poly)
        d_g_E_cal = np.sum(params * legendre_d_array_fun(x_1).T, 1)
        self.g_E_exp, self.g_E_cal, self.g_E_fun, self.g_E_fun_params = g_E_exp, g_E_cal, g_E_fun, params

        # use g_E_cal, d_g_E_cal to calculate gamma, partial pressures and finally y_1, p
        gamma_1_cal = np.exp(g_E_cal + x_2*d_g_E_cal)
        gamma_2_cal = np.exp(g_E_cal - x_1*d_g_E_cal)

        p_1_cal = x_1 * gamma_1_cal * ps_1
        p_2_cal = x_2 * gamma_2_cal * ps_2
        p_cal = p_1_cal + p_2_cal
        y_1_cal = p_1_cal / p
        y_2_cal = p_2_cal / p

        # calculate y, p residuals
        self.p_res = (p-p_cal) / p
        self.y_1_res = y_1 - y_1_cal
        self.y_2_res = y_2 - y_2_cal

        # calculate average y, p residuals [%]
        self.p_res_avg = np.mean(abs(self.p_res)) * 100
        self.y_1_res_avg = np.mean(abs(self.y_1_res)) * 100
        self.y_2_res_avg = np.mean(abs(self.y_2_res)) * 100

        conditions = np.array([self.p_res_avg, self.y_1_res_avg, self.y_2_res_avg]) <= cfg.fredenslund_criterion
        self.is_consistent = conditions.all()

        # tabulate
        self.x_tab = np.linspace(0, 1, cst.x_points_smooth_plot)
        self.g_E_tab = self.g_E_fun(self.x_tab, *self.g_E_fun_params)

    def get_title(self):
        return f'Fredenslund test for {super().get_title()}'

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        echo(f'p residual   = {self.p_res_avg:.2f} %')
        echo(f'y_1 residual = {self.y_1_res_avg:.2f} %')
        echo(f'y_2 residual = {self.y_2_res_avg:.2f} %')
        echo('')
        if self.is_consistent:
            ok_echo(
                f'OK, residuals of p, y_1, y_2 are all less than {cfg.fredenslund_criterion:.1f} %, data consistency is proven'
            )
        else:
            err_echo(
                f'NOT OK, residuals of p, y_1, y_2 must all be less than {cfg.fredenslund_criterion:.1f} %, data consistency is disproven'
            )
        echo('')
