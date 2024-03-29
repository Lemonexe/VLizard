import numpy as np
from scipy.integrate import quad
from scipy.interpolate import UnivariateSpline
from src.config import cfg
from .VLE import VLE


# common class for calculation of Area tests (currently used in Redlich-Kister and Herington)
class Area(VLE):

    def __init__(self, compound1, compound2, dataset_name):
        """
        Perform calculations of the integrals necessary for area tests, currently used in Redlich-Kister and Herington tests.

        compound1, compound2 (str): names of compounds
        dataset_name (str): name of dataset
        """
        super().__init__(compound1, compound2, dataset_name)
        gamma_1, gamma_2, x_1 = self.gamma_1, self.gamma_2, self.x_1

        # the "curve" is a function which will be integrated
        self.curve = np.log(gamma_1) - np.log(gamma_2)
        self.curve_spline = UnivariateSpline(x_1, self.curve)

        # ||A|-|B|| means integrating the function as it is
        self.curve_dif, err_dif = quad(self.curve_spline, 0, 1)
        self.curve_dif = abs(self.curve_dif)

        # ||A|+|B|| means integrating |function|
        self.curve_sum, err_sum = quad(lambda x: abs(self.curve_spline(x)), 0, 1)

        # warn if scipy declares a large integration error
        rel_err_max = max(abs(err_dif / self.curve_dif), abs(err_sum / self.curve_sum))
        if rel_err_max > cfg.rk_quad_rel_tol:
            self.warn(
                f'relative error of numerical integration is {rel_err_max:.1e}, limit is {cfg.rk_quad_rel_tol:.0e}. Calculation is to be considered unreliable.'
            )
