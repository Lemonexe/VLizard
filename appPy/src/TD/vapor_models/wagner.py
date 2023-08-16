import numpy as np
from .Vapor_Model import Vapor_Model


# Wagner equation for vapor pressure, which has four regular parameters A, B, C, D,
# and also critical parameters p_c, T_c. Those should not be regressed, but fixed at known values
def wagner_fun(T, A, B, C, D, p_c, T_c):
    tau = 1 - T/T_c  # flipped reduced temp
    exponent = (A*tau + B * tau**1.5 + C * tau**2.5 + D * tau**5) / (1-tau)
    return p_c * np.exp(exponent)


wagner_model = Vapor_Model(
    name='Wagner',
    fun=wagner_fun,
    n_params=6,
    params0=np.array([-7, 1.8, -2.5, -3, 3000, 400]),
    param_names=['A', 'B', 'C', 'D', 'p_c', 'T_c'],
)
