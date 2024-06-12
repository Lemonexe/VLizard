import numpy as np
from src.config import cst
from .VLE_Model import VLE_Model


def NRTL10(x_1, T, a_12, a_21, b_12, b_21, c_12, d_12, e_12, e_21, f_12, f_21):
    """
    Calculate activity coefficients using NRTL model (full version with 10 parameters).

    x_1 (float): mole fraction of compound1
    T (float): temperature [K]
    a_12, a_21, c_12, e_12, e_21 (float): dimensionless binary parameters
    b_12, b_21 (float): temperature dependent binary parameters [K]
    d_12 (float): temperature dependent binary parameter [°C^-1]
    f_12, f_21 (float): temperature dependent binary parameters [K^-1]
    return (np.array): activity coefficients as [gamma_1, gamma_2]
    """
    x_2 = 1 - x_1
    t = T - cst.C2K  # [°C]
    ln_T = np.log(T)

    tau_12 = a_12 + b_12/T + e_12*ln_T + f_12*T
    tau_21 = a_21 + b_21/T + e_21*ln_T + f_21*T

    # note: when alpha_12 = 0, NRTL model becomes Margules model
    alpha_21 = alpha_12 = c_12 + d_12*t

    G_12 = np.exp(-alpha_12 * tau_12)
    G_21 = np.exp(-alpha_21 * tau_21)

    den_12 = x_2 + x_1*G_12  # denominator with G_12
    den_21 = x_1 + x_2*G_21  # denominator with G_21
    ln_gamma_1 = x_2**2 * (tau_21 * (G_21 / den_21)**2 + tau_12*G_12/den_12/den_12)
    ln_gamma_2 = x_1**2 * (tau_12 * (G_12 / den_12)**2 + tau_21*G_21/den_21/den_21)
    return np.exp([ln_gamma_1, ln_gamma_2])


NRTL = lambda *params: NRTL10(*params, 0, 0, 0, 0, 0)
"""Simplified NRTL activity coefficient model with only first 5 parameters."""

NRTL_params0 = np.array([1, 1, 100, 100, 0.3], dtype='float64')
NRTL10_params0 = np.concatenate((NRTL_params0, np.zeros(5)))
NRTL10_params_names = ['a_12', 'a_21', 'b_12', 'b_21', 'c_12', 'd_12', 'e_12', 'e_21', 'f_12', 'f_21']
NRTL10_params_labels = [
    'a_12', 'a_21', 'b_12 / K', 'b_21 / K', 'c_12', 'd_12 / °C^-1', 'e_12', 'e_21', 'f_12 / K^-1', 'f_21 / K^-1'
]

NRTL_model = VLE_Model(
    name='NRTL',
    fun=NRTL,
    n_params=5,
    params0=NRTL10_params0[:5],
    param_names=NRTL10_params_names[:5],
    param_labels=NRTL10_params_labels[:5],
    is_gamma_T_fun=True,
)

NRTL10_model = VLE_Model(
    name='NRTL10',
    display_name='NRTL extended',
    fun=NRTL10,
    n_params=10,
    params0=NRTL10_params0,
    param_names=NRTL10_params_names,
    param_labels=NRTL10_params_labels,
    is_gamma_T_fun=True,
)
