import numpy as np
from .VLE_Model import VLE_Model


def margules(x_1, _T, A_12, A_21):
    """
    Calculate activity coefficients using Margules model.

    x_1 (float): mole fraction of compound1
    _T (float): temperature [K], not used
    A_12, A_21 (float): dimensionless binary parameters
    return (np.array): activity coefficients as [gamma_1, gamma_2]
    """
    x_2 = (1 - x_1)
    ln_gamma_1 = x_2**2 * (A_12 + 2 * x_1 * (A_21-A_12))
    ln_gamma_2 = x_1**2 * (A_21 + 2 * x_2 * (A_12-A_21))
    return np.exp([ln_gamma_1, ln_gamma_2])


margules_model = VLE_Model(
    name='Margules',
    fun=margules,
    n_params=2,
    params0=np.ones(2) * 0.5,
    param_names=['A_12', 'A_21'],
    is_gamma_T_fun=False,
)
