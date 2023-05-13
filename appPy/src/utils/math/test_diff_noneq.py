import pytest
import numpy as np
from math import pi
from .diff_noneq import get_diff_noneq_consts, diff_noneq, diffs_noneq, diffs_noneq_3

# vector of twenty sorted randomly generated numbers from 0 to 1 as test fixture
# yapf: disable
x_vec = np.array([0.01915698,0.0525313,0.05380665,0.08390383,0.13675854,0.24116141,0.32488405,0.46236529,0.53792819,0.57528869,0.61502928,0.61511705,0.69676865,0.70628807,0.73710621,0.7431038,0.83997656,0.89478248,0.95892033,0.96238809])
# yapf: enable


# test the formula to get constants, which are dependent only on x_vec grid & x_query point, using known formulae for equidistant
def test_get_diff_noneq_consts():
    rel_tol = 1e-6

    err = lambda C1, C2: np.max(abs(C1 - C2))

    C_num = get_diff_noneq_consts([0.2, 0.3, 0.4], 0.3)
    C_anal = [-5, 0, 5]  # btw they are already divided by (2*h) = 0.2
    assert err(C_num, C_anal) < rel_tol

    C_num = get_diff_noneq_consts([6.5, 7.0, 7.5], 6.5)
    C_anal = [-3, 4, -1]
    assert err(C_num, C_anal) < rel_tol

    C_num = get_diff_noneq_consts([6.5, 7.0, 7.5], 7.5)
    C_anal = [1, -4, 3]
    assert err(C_num, C_anal) < rel_tol


# on x_vec grid query derivation at single x point
# fx  = sin(x)
# dfx = cos(x)
def test_diff_noneq():
    rel_tol = 1e-6
    x_query = pi / 6
    dsin = diff_noneq(x_vec, np.sin(x_vec), x_query)
    assert abs(dsin / np.cos(x_query) - 1) < rel_tol


# on x_vec grid query derivation at vector x, in *this* case same as x_vec
# fx  = ln(2 + x)
# dfx = 1 / x
def test_diffs_noneq_single():
    rel_tol = 1e-6
    y = np.log(2 + x_vec)
    dy_anal = 1 / (2+x_vec)
    dy_num = diffs_noneq(x_vec, y, x_vec)
    assert dy_num.shape == x_vec.shape

    err = abs(dy_anal/dy_num - 1)
    assert np.max(err) < rel_tol

    # mathematically this should be the very same. Note that it's only possible because in this test, x_vec = x_query_vec
    y = 2 + x_vec
    dy_num = diffs_noneq(x_vec, y, x_vec) / y
    assert dy_num.shape == x_vec.shape

    err = abs(dy_anal/dy_num - 1)
    assert np.max(err) < rel_tol


# on x_vec grid query derivation at arbitrary vector x
# f1x  = sin(x)
# df1x = cos(x)
# f2x  = x**2 - 1.2*x + 0.8
# df2x = 2*x - 1.2
def test_diffs_noneq_multiple():
    rel_tol = 1e-6
    x_qn = 29  # number of queried points
    x_query_vec = np.linspace(0.1, 0.9, x_qn)

    y_1 = np.sin(x_vec)
    y_2 = x_vec**2 - 1.2*x_vec + 0.8
    y_12 = np.array([y_1, y_2])

    dy_anal_1 = np.cos(x_query_vec)
    dy_anal_2 = 2*x_query_vec - 1.2

    dy_num = diffs_noneq(x_vec, y_12, x_query_vec)
    dy_num_1 = dy_num[0, :]
    dy_num_2 = dy_num[1, :]
    assert dy_num.shape == (2, x_qn)

    err_1 = abs(dy_anal_1/dy_num_1 - 1)
    err_2 = abs(dy_anal_2/dy_num_2 - 1)

    assert np.max(err_1) < rel_tol
    assert np.max(err_2) < rel_tol

    # error when len(x) != len(y)
    with pytest.raises(ValueError):
        diff_noneq(x_vec, np.sin(x_query_vec), 0.5)


# on x_vec grid query derivations using 3 point formula (automatically x_vec is queried)
# fx same as in 'test_diffs_noneq_multiple'
def test_diffs_noneq_3():
    rel_tol = 1e-2

    y_1 = np.sin(x_vec)
    y_2 = x_vec**2 - 1.2*x_vec + 0.8
    y_12 = np.array([y_1, y_2])

    dy_anal_1 = np.cos(x_vec)
    dy_anal_2 = 2*x_vec - 1.2

    dy_num = diffs_noneq_3(x_vec, y_12)
    dy_num_1 = dy_num[0, :]
    dy_num_2 = dy_num[1, :]

    assert dy_num.shape == y_12.shape

    err_1 = abs(dy_anal_1/dy_num_1 - 1)
    err_2 = abs(dy_anal_2/dy_num_2 - 1)

    assert np.max(err_1) < rel_tol
    assert np.max(err_2) < rel_tol

    # error when len < 3
    with pytest.raises(ValueError):
        diffs_noneq_3([1, 2], [7, 8])
