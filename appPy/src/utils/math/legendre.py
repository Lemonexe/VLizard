import math
import numpy as np


def get_legendre_poly(n):
    """
    Generate polynomial coeffs of shifted Legendre polynomials.

    n (int): order of polynomial, must be >= 0
    return (np.array(n+1)): polynomial coeffs
    """
    poly = np.zeros(n + 1, dtype='int32')
    for i in range(n + 1):
        poly[i] = math.comb(n, i) * math.comb(n + i, i) * (-1)**i
    poly *= (-1)**n
    return np.flip(poly)


def get_d_poly(poly):
    """
    Generate polynomial coeffs of derivation of given polynomial coeffs.

    poly (np.array(n)): polynomial coeffs of n-th order polynomial
    return (np.array(n-1)): polynomial coeffs of the derived polynomial
    """
    poly = np.array(poly)
    n = len(poly) - 1
    exps = np.arange(n, 0, -1)  # exponents of x^n terms in poly, except x^0 which is eliminated
    return poly[:-1] * exps


def get_g_E_poly(n):
    """
    Generate polynomial coeffs of shifted Legendre polynomial multiplied with x*(1-x).
    That's useful for fitting g_E(x) in Fredenslund test.

    n...
    return (np.array(n+3)): coeffs of g_E polynomial
    """
    poly = get_legendre_poly(n)
    part1 = np.concatenate((-poly, [0, 0]))  # poly * -x^2
    part2 = np.concatenate(([0], +poly, [0]))  # poly * x
    return part1 + part2


def get_d_g_E_poly(n):
    """
    Generate polynomial coeffs of derivation of shifted Legendre polynomial multiplied with x*(1-x).

    n...
    return (np.array(n+2)): coeffs of derived g_E polynomial
    """
    return get_d_poly(get_g_E_poly(n))


def get_ordered_array_fun(n, fun):
    """
    Generate a lambda x: np.array(n+1) function, where each cell 'i' is a polynomial function from generator function.
    They are generated for i from 0 to n.
    Mainly used to generate an array of Legendre polynomials rising from 0 to n-th order.

    n (int): number of functions
    fun (lambda n: np.array(any)): function that is expected to generate polynomial coeffs from 'i', e.g. 'get_legendre_poly'

    return (lambda x: array(n+1))
    """
    poly_funs = list(map(np.poly1d, map(fun, range(n + 1))))  # generate list of lambda x functions
    return lambda x: np.array(list(map(lambda fun: fun(x), poly_funs)))  # transform to lambda x: array
