import numpy as np
from .VLE_Model import VLE_Model


def van_Laar(x_1, _T, A_12, A_21):
    """
    Calculate activity coefficients using the van Laar model.

    x_1 (float): mole fraction of compound1
    _T (float): temperature [K], not used
    A_12, A_21 (float): dimensionless binary parameters
    return (np.array): activity coefficients as [gamma_1, gamma_2]
    """
    x_2 = (1 - x_1)
    denominator = A_12*x_1 + A_21*x_2
    ln_gamma_1 = A_12 * (A_21 * x_2 / denominator)**2
    ln_gamma_2 = A_21 * (A_12 * x_1 / denominator)**2
    return np.exp([ln_gamma_1, ln_gamma_2])


van_Laar_model = VLE_Model(
    name='vanLaar',
    display_name='van Laar',
    fun=van_Laar,
    n_params=2,
    params0=np.ones(2) * 0.5,
    param_names=['A_12', 'A_21'],
    is_gamma_T_fun=False,
)
