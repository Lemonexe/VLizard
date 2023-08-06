import numpy as np

van_Laar_params0 = np.array([0.5, 0.5]) # generic initial estimate

# parametrized van Laar activity coefficient model to calculate [gamma1, gamma2]
# using binary parameters A_12, A_21 and err_1,err_2 as offset of gamma_1(x_1=1),gamma_2(x_2=1) from 1
# such offset is TD impossible, and that's why calculating it is useful as data quality evaluation
def van_Laar_with_error(x_1, A_12, A_21, err_1, err_2):
    x_2 = (1 - x_1)
    denominator = A_12*x_1 + A_21*x_2
    ln_gamma_1 = A_12 * (A_21 * x_2 / denominator)**2 + err_1
    ln_gamma_2 = A_21 * (A_12 * x_1 / denominator)**2 + err_2
    return np.exp([ln_gamma_1, ln_gamma_2])


# the actual TD correct Van Laar model (offset from 1 is 0)
van_Laar = lambda x_1, A_12, A_21: van_Laar_with_error(x_1, A_12, A_21, err_1=0, err_2=0)

# although van Laar is not temperature dependent, a united interface is required for fitting
van_Laar_with_T = lambda x_1, T, A_12, A_21: van_Laar(x_1, A_12, A_21)
