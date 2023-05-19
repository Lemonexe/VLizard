import math
import numpy as np


# get polynomial coeffs of shifted Legendre polynomial of order 'n'
def get_legendre_poly(n):
    poly = np.zeros(n + 1, dtype='int32')
    for i in range(n + 1):
        poly[i] = math.comb(n, i) * math.comb(n + i, i) * (-1)**i
    poly *= (-1)**n
    return np.flip(poly)


# get polynomial coeffs of derivation of given polynomial coeffs
def get_d_poly(poly):
    poly = np.array(poly)
    n = len(poly) - 1
    exps = np.arange(n, 0, -1)  # exponents of x^n terms in poly, except x^0 which is eliminated
    return poly[:-1] * exps


# get polynomial coeffs of shifted Legendre polynomial of order 'n' multiplied with x*(1-x)
# that's useful for Fredenslund test
def get_g_E_poly(n):
    poly = get_legendre_poly(n)
    part1 = np.concatenate((-poly, [0, 0]))  # poly * -x^2
    part2 = np.concatenate(([0], +poly, [0]))  # poly * x
    return part1 + part2


# derivation of get_g_E_poly
get_d_g_E_poly = lambda n: get_d_poly(get_g_E_poly(n))


# generate a lambda x: array(n+1), where cell 'i' is Legendre polynom of i-th order
# polynomial functions are generated from 'i' using a fun such as get_legendre_poly; see Fredenslund test
def get_ordered_array_fun(n, fun):
    poly_funs = list(map(np.poly1d, map(fun, range(n + 1))))  # generate list of lambda x functions
    return lambda x: np.array(list(map(lambda fun: fun(x), poly_funs)))  # transform to lambda x: array
