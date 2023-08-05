import numpy as np

# parametrized van Laar activity coefficient model to calculate [gamma1, gamma2]
# using binary parameters A_12, A_21 and err_1,err_2 as offset of gamma_1(x_1=1),gamma_2(x_2=1) from 1
# such offset is TD impossible, and that's why calculating it is useful as data quality evaluation


def van_Laar_with_error(x_1, A_12, A_21, err_1, err_2):
    x_2 = (1 - x_1)
    denominator = A_12*x_1 + A_21*x_2
    return np.exp(np.array([A_12 * (A_21 * x_2 / denominator)**2 + err_1,
                            A_21 * (A_12 * x_1 / denominator)**2 + err_2]))


# simplified (and TD correct) version where offset from 1 is 0
van_Laar = lambda x_1, A_12, A_21: van_Laar_with_error(x_1, A_12, A_21, 0, 0)
