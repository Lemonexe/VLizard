import numpy as np
from .Vapor_Model import Vapor_Model


def wagner_fun(T, A, B, C, D, p_c, T_c):
    """
    Calculate vapor pressure using Wagner equation.

    T (float): temperature [K]
    p_c (float): critical pressure [kPa]
    T_c (float): critical temperature [K]
    A, B, C, D (float): dimensionless parameters
    return (float): vapor pressure [kPa]
    """
    tau = 1 - T/T_c  # flipped reduced temp
    exponent = (A*tau + B * tau**1.5 + C * tau**2.5 + D * tau**5) / (1-tau)
    return p_c * np.exp(exponent)


wagner_model = Vapor_Model(name='Wagner',
                           fun=wagner_fun,
                           n_params=6,
                           params0=np.array([-8, 1, -1, -1, 1e4, 1e3]),
                           param_names=['A', 'B', 'C', 'D', 'p_c', 'T_c'],
                           param_labels=['A', 'B', 'C', 'D', 'p_c / kPa', 'T_c / K'],
                           always_const_param_names=['p_c', 'T_c'])
