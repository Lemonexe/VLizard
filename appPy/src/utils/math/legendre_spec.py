import numpy as np
from .legendre import get_legendre_poly, get_d_poly, get_g_E_poly, get_ordered_array_fun

# polynomial coeffs of first five shifted Legendre polynomials
Legendre_0_poly = np.array([+1], dtype='int32')
Legendre_1_poly = np.array([+2, -1], dtype='int32')
Legendre_2_poly = np.array([+6, -6, +1], dtype='int32')
Legendre_3_poly = np.array([+20, -30, +12, -1], dtype='int32')
Legendre_4_poly = np.array([+70, -140, +90, -20, +1], dtype='int32')

# polynomial coeffs of n=4 Legendre multiplied by x*(1-x), and its derivation
g_E_4_poly = np.array([-70, +210, -230, +110, -21, +1, 0], dtype='int32')
d_g_E_4_poly = np.array([-420, +1050, -920, +330, -42, +1], dtype='int32')


def test_get_legendre_poly():
    """Test generation of shifted Legendre polynomial coeffs."""
    assert np.array_equal(get_legendre_poly(0), Legendre_0_poly)
    assert np.array_equal(get_legendre_poly(1), Legendre_1_poly)
    assert np.array_equal(get_legendre_poly(2), Legendre_2_poly)
    assert np.array_equal(get_legendre_poly(3), Legendre_3_poly)
    assert np.array_equal(get_legendre_poly(4), Legendre_4_poly)


def test_get_g_E_poly():
    """Test generation of polynomial coeffs for Legendre multiplied by x*(1-x)."""
    assert np.array_equal(get_g_E_poly(0), np.array([-1, 1, 0]))
    assert np.array_equal(get_g_E_poly(4), g_E_4_poly)


def test_get_d_poly():
    """Test derivation of polynomial coeffs."""
    assert np.array_equal(get_d_poly([4, 5, 6]), [8, 5])
    assert np.array_equal(get_d_poly(g_E_4_poly), d_g_E_4_poly)


def test_get_ordered_array_fun():
    """Test creation of lambda x: array(n+1)."""
    # create function of constants, ordered from n = 0 to 7
    fun = get_ordered_array_fun(7, lambda n: [n])
    assert np.array_equal(fun(777), [0, 1, 2, 3, 4, 5, 6, 7])

    # create function of n*x + n, ordered from n = 0 to 3
    fun = get_ordered_array_fun(3, lambda n: [n, n])
    assert np.array_equal(fun(7), [0, 7 + 1, 14 + 2, 21 + 3])

    # create function of g_E polynomials of 4th order, and test it at given 'x'
    x = 2 / 3
    fun = get_ordered_array_fun(4, get_legendre_poly)
    poly_list = [Legendre_0_poly, Legendre_1_poly, Legendre_2_poly, Legendre_3_poly, Legendre_4_poly]
    expected_return = np.array(list(map(lambda poly: np.poly1d(poly)(x), poly_list)))
    assert np.array_equal(fun(x), expected_return)
