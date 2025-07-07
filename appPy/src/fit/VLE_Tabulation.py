import numpy as np
from scipy.optimize import root
from src.config import cst, cfg
from src.utils.Result import Result
from src.utils.UoM import convert_p, convert_T
from src.utils.errors import AppException
from src.TD.Vapor import Vapor


class VLE_Tabulation(Result):

    def __init__(self, model, params, compound1, compound2, p_spec, T_spec, label):
        """
        Create isobaric tabulation of a VLE dataset using a thermodynamic model and its params

        model (VLE_Model): instance of selected thermodynamic VLE model
        params (list of floats or np.array(n)): model parameters
        compound1, compound2 (str): names of compounds
        name (str): name of the tabulation
        p_spec (float): constant pressure for tabulation, exclusive with T [kPa]
        T_spec (float): constant temperature for tabulation, exclusive with p [K]
        label (str or None): name of the tabulation
        """
        super().__init__()
        self.keys_to_serialize = ['p_spec', 'T_spec', 'is_isobaric', 'name']

        if (p_spec is None and T_spec is None) or (p_spec is not None and T_spec is not None):
            raise AppException('Either p or T, exclusively, must be specified for VLE tabulation')
        self.is_isobaric = p_spec is not None
        self.p_spec = p_spec
        self.T_spec = T_spec
        self.model = model
        self.model_name = model.display_name
        self.params = params

        if label is None:
            if self.is_isobaric:
                label = f'at {convert_p(self.p_spec):.1f} {cfg.UoM_p}'
            else:
                label = f'at {convert_T(self.T_spec):.3g} {cfg.UoM_T}'
        self.title = self.name = f'{model.display_name} {label}'

        n = cst.x_points_smooth_plot
        self.x_1 = np.linspace(0, 1, n)
        self.T = np.zeros(n) if self.is_isobaric else np.full(n, T_spec)
        self.p = np.zeros(n) if not self.is_isobaric else np.full(n, p_spec)

        self.y_1 = self.y_1 = np.zeros(n)
        self.y_2 = self.y_2 = np.zeros(n)
        self.gamma_1 = self.gamma_1 = np.zeros(n)
        self.gamma_2 = self.gamma_2 = np.zeros(n)

        # pure compound properties
        self.vapor_1 = Vapor(compound1)
        self.vapor_2 = Vapor(compound2)
        self.ps_fun_1 = self.vapor_1.ps_fun
        self.ps_fun_2 = self.vapor_2.ps_fun

        if self.is_isobaric:
            self.__tabulate_isobaric()
        else:
            self.__tabulate_isothermal()

        self.merge_warnings(self.vapor_1, self.vapor_2)

    def __tabulate_isobaric(self):
        """
        Tabulate VLE dataset at constant pressure, using the thermodynamic model and its parameters.
        For each point, a transcendental equation must be solved for T,
        which is estimated by linear interpolation of T_boil of pure compounds.
        """
        vapor_1, vapor_2, ps_fun_1, ps_fun_2 = self.vapor_1, self.vapor_2, self.ps_fun_1, self.ps_fun_2
        p_spec, model, params = self.p_spec, self.model, self.params
        T, y_1, y_2, gamma_1, gamma_2 = self.T, self.y_1, self.y_2, self.gamma_1, self.gamma_2

        T_boil_1 = self.vapor_1.get_T_boil(self.p_spec)
        T_boil_2 = self.vapor_2.get_T_boil(self.p_spec)

        for i, x_1i in enumerate(self.x_1):
            T_boil_est = T_boil_2 + (T_boil_1-T_boil_2) * x_1i  # linear interpolation of pures as initial estimate
            result = calc_VLE_point_isobaric(model, params, ps_fun_1, ps_fun_2, p_spec, x_1i, T_boil_est)
            T[i], y_1[i], y_2[i], gamma_1[i], gamma_2[i] = result

        T_data_bounds = (np.min(self.T), np.max(self.T))
        vapor_1.check_T_bounds(*T_data_bounds)
        vapor_2.check_T_bounds(*T_data_bounds)

    def __tabulate_isothermal(self):
        """
        Tabulate VLE dataset at constant temperature, using the thermodynamic model and its parameters.
        This is a simple direct calculation.
        """
        ps_fun_1, ps_fun_2 = self.ps_fun_1, self.ps_fun_2
        T_spec, model, params = self.T_spec, self.model, self.params
        p, y_1, y_2, gamma_1, gamma_2 = self.p, self.y_1, self.y_2, self.gamma_1, self.gamma_2

        for i, x_1i in enumerate(self.x_1):
            result = calc_VLE_point_isotherm(model, params, ps_fun_1, ps_fun_2, T_spec, x_1i)
            p[i], y_1[i], y_2[i], gamma_1[i], gamma_2[i] = result


def calc_VLE_point_isotherm(model, params, ps_fun_1, ps_fun_2, T_spec, x_1):
    """
    Calculate one VLE point with given temperature, using a thermodynamic model and its params.

    model (VLE_Model): instance of selected thermodynamic VLE model
    params (list of floats or np.array(n)): model parameters
    ps_fun_1 (function): vapor pressure function for compound1 as p [kPa] = f(T [K])
    ps_fun_2 (function): vapor pressure function for compound2 as p [kPa] = f(T [K])
    T (float): temperature [K]
    x_1 (float): mole fraction of compound1
    """
    x_2 = 1 - x_1
    gamma_1, gamma_2 = model.fun(x_1, T_spec, *params)
    # simple Raoult's Law
    p_1 = x_1 * gamma_1 * ps_fun_1(T_spec)
    p_2 = x_2 * gamma_2 * ps_fun_2(T_spec)
    p = p_1 + p_2
    y_1 = p_1 / p
    y_2 = 1 - y_1
    return p, y_1, y_2, gamma_1, gamma_2


def calc_VLE_point_isobaric(model, params, ps_fun_1, ps_fun_2, p_spec, x_1, T_boil_est=400):
    """
    Calculate one VLE point with given pressure, using a thermodynamic model and its params.

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

    # partial pressures as per Raoult's Law as functions of T
    p_1 = lambda gamma_1, T: x_1 * gamma_1 * ps_fun_1(T)
    p_2 = lambda gamma_2, T: x_2 * gamma_2 * ps_fun_2(T)

    # resid of equation to solve for T: p_1(T) + p_2(T) = p
    def resid(T):
        gamma_1, gamma_2 = get_gamma_12(T)
        return p_1(gamma_1, T) + p_2(gamma_2, T) - p_spec

    # find boiling temperature
    sol = root(fun=resid, x0=np.array([T_boil_est]), tol=cst.T_boil_tol)
    if not sol.success: raise AppException(f'Error while tabulating model – could not find T for x_1 = {x_1}')
    T_boil = sol.x[0]

    # calculate activity coefficients at boiling temperature and vapor phase composition
    gamma_1_final, gamma_2_final = get_gamma_12(T_boil)
    y_1 = p_1(gamma_1_final, T_boil) / p_spec
    y_2 = 1 - y_1
    return T_boil, y_1, y_2, gamma_1_final, gamma_2_final
