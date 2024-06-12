import numpy as np
from .VLE_Model import VLE_Model


def UNIQUAC13(x_1, T, q_1, q_2, r_1, r_2, a_12, a_21, b_12, b_21, c_12, c_21, d_12, d_21, e_12):
    """
    Calculate activity coefficients using UNIQUAC model (full version with 13 parameters).

    x_1 (float): mole fraction of compound1
    T (float): temperature [K]
    q_1, q_2 (float): dimensionless surface areas
    r_1, r_2 (float): numbers of segments (or also dimensionless volumes)
    a_12, a_21 (float): dimensionless binary interaction parameters
    b_12, b_21 (float): binary interaction parameters [K]
    c_12, c_21 (float): binary interaction parameters [1/ln(K)]
    d_12, d_21 (float): binary interaction parameters [K^-1]
    e_12 (float): symmetrical binary interaction parameter [K^-2]
    """
    x_2 = 1 - x_1

    # some kind of coordination numbers?
    l_1 = 5 * (r_1-q_1) + 1 - r_1
    l_2 = 5 * (r_2-q_2) + 1 - r_2

    # mean values
    avg_l = x_1*l_1 + x_2*l_2
    avg_r = x_1*r_1 + x_2*r_2
    avg_q = x_1*q_1 + x_2*q_2

    # segment volume fractions, and their terms divided by x_i to avoid division by zero when x_i=0
    # ph_1 = r_1 * x_1 / avg_r
    # ph_2 = r_2 * x_2 / avg_r
    PH_1 = r_1 / avg_r
    PH_2 = r_2 / avg_r

    # surface area fractions (same as above)
    th_1 = q_1 * x_1 / avg_q
    th_2 = q_2 * x_2 / avg_q
    TH_1 = q_1 / avg_q
    TH_2 = q_2 / avg_q

    # binary interaction terms
    tau_12 = np.exp(a_12 + b_12/T + c_12 * np.log(T) + d_12*T + e_12*T*T)
    tau_21 = np.exp(a_21 + b_21/T + c_21 * np.log(T) + d_21*T + e_12*T*T)
    s_1 = th_1 + th_2*tau_21
    s_2 = th_1*tau_12 + th_2

    # combinatorial part
    ln_gamma_1_C = l_1 + np.log(PH_1) + 5 * q_1 * np.log(TH_1 / PH_1) - PH_1*avg_l
    ln_gamma_2_C = l_2 + np.log(PH_2) + 5 * q_2 * np.log(TH_2 / PH_2) - PH_2*avg_l

    # alternative calculation for debug, you can see they are equal
    # ln_gamma_1_C_a = 1 - PH_1 + np.log(PH_1) - 5 * q_1 * (1 - PH_1/TH_1 + np.log(PH_1 / TH_1))
    # ln_gamma_2_C_a = 1 - PH_2 + np.log(PH_2) - 5 * q_2 * (1 - PH_2/TH_2 + np.log(PH_2 / TH_2))

    # residual part
    ln_gamma_1_R = q_1 * (1 - np.log(s_1) - th_1/s_1 - th_2*tau_12/s_2)
    ln_gamma_2_R = q_2 * (1 - np.log(s_2) - th_1*tau_21/s_1 - th_2/s_2)

    ln_gamma_1 = ln_gamma_1_C + ln_gamma_1_R
    ln_gamma_2 = ln_gamma_2_C + ln_gamma_2_R

    return np.exp([ln_gamma_1, ln_gamma_2])


UNIQUAC = lambda *params: UNIQUAC13(*params, 0, 0, 0, 0, 0)
"""Simplified UNIQUAC activity coefficient model with only first 8 parameters."""

UNIQUAC_params0 = np.array([5, 5, 5, 5, 1, 1, 100, 100], dtype='float64')
UNIQUAC13_params0 = np.concatenate((UNIQUAC_params0, np.zeros(5)))
UNIQUAC13_params_names = [
    'q_1', 'q_2', 'r_1', 'r_2', 'a_12', 'a_21', 'b_12', 'b_21', 'c_12', 'c_21', 'd_12', 'd_21', 'e_12'
]
UNIQUAC_always_const = ['q_1', 'q_2', 'r_1', 'r_2']

UNIQUAC_model = VLE_Model(
    name='UNIQUAC',
    fun=UNIQUAC,
    n_params=8,
    params0=UNIQUAC13_params0[:8],
    param_names=UNIQUAC13_params_names[:8],
    always_const_param_names=UNIQUAC_always_const,
    is_gamma_T_fun=True,
)

UNIQUAC13_model = VLE_Model(
    name='UNIQUAC13',
    display_name='UNIQUAC extended',
    fun=UNIQUAC13,
    n_params=13,
    params0=UNIQUAC13_params0,
    param_names=UNIQUAC13_params_names,
    always_const_param_names=UNIQUAC_always_const,
    is_gamma_T_fun=True,
)
