import numpy as np
# from scipy.integrate import quad
# from scipy.interpolate import UnivariateSpline
from scipy.optimize import curve_fit
from matplotlib import pyplot as plt
from src.utils.underline import underline
from src.utils.math.legendre import legendre_terms, d_legendre_terms, legendre_order
# from src.config import x_points_smooth_plot, rk_D_criterion, rk_quad_rel_tol
from src.consts import R
from .VLE import VLE


# perform Fredenslund test as object with results, and methods for visualization
class Fredenslund_test(VLE):

    def __init__(self, compound1, compound2, dataset_name):
        super().__init__(compound1, compound2, dataset_name)
        (x_1, gamma_1, x_2, gamma_2) = (self.x_1, self.gamma_1, self.x_2, self.gamma_2)

        # note: g_E means dimensionless excess molar Gibbs energy (g_E = G_mE / RT)
        
        # g_E vector from experimental values
        g_E_exp = (x_1*np.log(gamma_1) + x_2*np.log(gamma_2))

        # parametrized model function to calculate g_E using Legendre polynomials
        g_E_fun = lambda x, *params: np.sum(params * legendre_terms(x).T, 1)

        # perform non-lin regression to get the multiplying parameters 
        params0 = np.ones(legendre_order + 1, dtype='float64')
        params, *_rest = curve_fit(g_E_fun, x_1, g_E_exp, p0=params0)

        # g_E vector from Legendre model
        g_E_calc = g_E_fun(x_1, *params)

        # d(g_E)/dx vector from Legendre model
        d_g_E_calc = np.sum(params * d_legendre_terms(x_1).T, 1)


        self.g_E_exp, self.g_E_calc = g_E_exp, g_E_calc

        print(params)
        plt.axhline(y=0, color='k', linestyle=':')
        plt.plot(x_1, g_E_exp, '^b')
        plt.plot(x_1, g_E_calc, 'vr')
        xx=np.linspace(0,1,100)
        plt.plot(xx, g_E_fun(xx, *params), ':r')
        plt.show()

    def get_title(self):
        return f'Fredenslund test for {super().get_title()}'

    def report(self):
        print(underline(self.get_title()))
        self.report_warnings()
        print('')

    def plot_g_E(self):
        plt.axhline(y=0, color='k', linestyle=':')
        plt.title(self.get_title())
        plt.xlim(0, 1)
        plt.xlabel('$x_1$')
        plt.ylabel('ln $\\gamma_1/\\gamma_2$')
