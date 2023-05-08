import numpy as np
from math import pi
from src.utils.math.diff_noneq import diff_noneq, diffs_noneq

# vector of fifty sorted randomly generated numbers from 0 to 1
# yapf: disable
x_vec = np.array([0.01915698,0.0525313,0.05380665,0.08390383,0.13675854,0.24116141,0.32488405,0.46236529,0.53792819,0.57528869,0.61502928,0.61511705,0.69676865,0.70628807,0.73710621,0.7431038,0.83997656,0.89478248,0.95892033,0.96238809])
# yapf: enable


def test_diff_noneq():
    rel_tol = 1e-6
    x_query = pi / 6
    dsin = diff_noneq(x_vec, np.sin(x_vec), x_query)
    assert abs(dsin / np.cos(x_query) - 1) < rel_tol


def test_diffs_noneq_single():
    rel_tol = 1e-2
    y = np.log(x_vec)
    x_query_vec = np.linspace(0.1, 0.9, 25)
    dy_anal = 1 / x_query_vec
    dy_num = diffs_noneq(x_vec, y, x_query_vec)

    err = abs(dy_anal/dy_num - 1)

    assert not (err > rel_tol).any()


def test_diffs_noneq_multiple():
    rel_tol = 1e-6
    y_1 = np.sin(x_vec)
    y_2 = x_vec**2 - 1.2*x_vec + 0.8
    y_12 = np.array([y_1, y_2])

    dy_anal_1 = np.cos(x_vec)
    dy_anal_2 = 2*x_vec - 1.2

    dy_num = diffs_noneq(x_vec, y_12, x_vec)
    dy_num_1 = dy_num[0, :]
    dy_num_2 = dy_num[1, :]

    err_1 = abs(dy_anal_1/dy_num_1 - 1)
    err_2 = abs(dy_anal_2/dy_num_2 - 1)

    assert not (err_1 > rel_tol).any()
    assert not (err_2 > rel_tol).any()
