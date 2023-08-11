import numpy as np
from src.config import R
from .Model import Model


# parametrized NRTL activity coefficient model to calculate [gamma_1, gamma_2]
def NRTL(x_1, T, A_12, A_21, g_11, g_22, g_12):
    x_2 = 1 - x_1
    tau_12 = (g_12-g_22) / R / T
    tau_21 = (g_12-g_11) / R / T
    G_12 = np.exp(-A_12 * tau_12)
    G_21 = np.exp(-A_21 * tau_21)
    den_12 = x_2 + x_1*G_12  # denominator with G_12
    den_21 = x_1 + x_2*G_21  # denominator with G_21
    ln_gamma_1 = x_2**2 * (tau_21 * (G_21 / den_21)**2 + tau_12*G_12/den_12)
    ln_gamma_2 = x_1**2 * (tau_12 * (G_12 / den_12)**2 + tau_21*G_21/den_21)
    return np.exp([ln_gamma_1, ln_gamma_2])


NRTL_model = Model(
    name='NRTL',
    fun=NRTL,
    n_params=5,
    params0=np.zeros(5),
    param_names=['A_12', 'A_21', 'g_11', 'g_22', 'g_12'],
    is_gamma_T_fun=True,
)
