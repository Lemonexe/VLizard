import numpy as np
from scipy.optimize import root
from src.config import cst
from src.utils.Result import Result
from src.utils.errors import AppException
from src.TD.Vapor import Vapor


class VLE_Tabulation(Result):

    def __init__(self, model, params, compound1, compound2, name, p):
        """
        Create isobaric tabulation of a VLE dataset using a thermodynamic model and its params

        model (VLE_Model): instance of selected thermodynamic VLE model
        params (list of floats or np.array(n)): model parameters
        compound1, compound2 (str): names of compounds
        name (str): name of the tabulation
        p (float): constant pressure for tabulation [kPa]
        """
        super().__init__()
        self.keys_to_serialize = ['p', 'name']
        self.name = name
        self.title = f'{compound1}-{compound2} with {model.display_name} for {name}'
        self.model_name = model.display_name
        self.p = p

        n = cst.x_points_smooth_plot
        x_1 = self.x_1 = np.linspace(0, 1, n)
        T = self.T = np.zeros(n)
        y_1 = self.y_1 = np.zeros(n)
        y_2 = self.y_2 = np.zeros(n)
        gamma_1 = self.gamma_1 = np.zeros(n)
        gamma_2 = self.gamma_2 = np.zeros(n)

        vapor_1 = Vapor(compound1)
        vapor_2 = Vapor(compound2)
        ps_fun_1 = vapor_1.ps_fun
        ps_fun_2 = vapor_2.ps_fun
        T_boil_1 = vapor_1.get_T_boil(p)
        T_boil_2 = vapor_2.get_T_boil(p)

        # tabulate for each point in VLE dataset
        for i, x_1i in enumerate(x_1):
            T_boil_est = T_boil_2 + (T_boil_1-T_boil_2) * x_1i  # linear interpolation of pures as initial estimate
            result = tabulate_VLE_point(model, params, ps_fun_1, ps_fun_2, p, x_1i, T_boil_est)
            T[i], y_1[i], y_2[i], gamma_1[i], gamma_2[i] = result

        T_data_bounds = (np.min(self.T), np.max(self.T))
        vapor_1.check_T_bounds(*T_data_bounds)
        vapor_2.check_T_bounds(*T_data_bounds)
        self.merge_warnings(vapor_1, vapor_2)


def tabulate_VLE_point(model, params, ps_fun_1, ps_fun_2, p, x_1, T_boil_est=400):
    """
    Tabulate one VLE point using a thermodynamic model and its params

    model (VLE_Model): instance of selected thermodynamic VLE model
    params (list of floats or np.array(n)): model parameters
    ps_fun_1 (function): vapor pressure function for compound1 as p [kPa] = f(T [K])
    ps_fun_2 (function): vapor pressure function for compound2 as p [kPa] = f(T [K])
    p (float): pressure [kPa]
    x_1 (float): mole fraction of compound1
    T_boil_est (optional float): optional estimate of boiling point
    """
    x_2 = 1 - x_1

    # when gamma model is dependent on T, always calculate gamma together with T
    if model.is_gamma_T_fun:
        get_gamma_12 = lambda T: model.fun(x_1, T, *params)
    # when gamma model is independent on T, calculate gamma once and return the cached value, as an optimization
    else:
        gamma_12_const = model.fun(x_1, 0, *params)  # pass 0 as temperature since it doesn't matter
        get_gamma_12 = lambda T: gamma_12_const

    # partial pressures as per Raoult's Law
    p_1 = lambda gamma_1, T: x_1 * gamma_1 * ps_fun_1(T)
    p_2 = lambda gamma_2, T: x_2 * gamma_2 * ps_fun_2(T)

    # resid of equation to solve for T: p_1(T) + p_2(T) = p
    def resid(T):
        gamma_1, gamma_2 = get_gamma_12(T)
        return p_1(gamma_1, T) + p_2(gamma_2, T) - p

    # find boiling temperature
    sol = root(fun=resid, x0=np.array([T_boil_est]), tol=cst.T_boil_tol)
    if not sol.success: raise AppException(f'Error while tabulating model – could not find T for x_1 = {x_1}')
    T_boil = sol.x[0]

    # calculate activity coefficients at boiling temperature and vapor phase composition
    gamma_1_final, gamma_2_final = get_gamma_12(T_boil)
    y_1 = p_1(gamma_1_final, T_boil) / p
    y_2 = 1 - y_1
    return T_boil, y_1, y_2, gamma_1_final, gamma_2_final
