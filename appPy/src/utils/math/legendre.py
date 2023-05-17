import numpy as np

# Functions for Legendre polynomials multiplied by x*(1-x), and their derivations, up to 4th order
# the polynomials could be inferred from the progression, but it is more practical to have the definitions expanded

legendre_order = 4  # order used in here

legendre_terms = lambda x: np.array([
    -x**2 + x,
    -2 * x**3 + 3 * x**2 - x,
    -6 * x**4 + 12 * x**3 - 7 * x**2 + x,
    -20 * x**5 + 50 * x**4 - 42 * x**3 + 13 * x**2 - x,
    -70 * x**6 + 210 * x**5 - 230 * x**4 + 110 * x**3 - 21 * x**2 + x,
])

d_legendre_terms = lambda x: np.array([
    -2 * x + 1,
    -6 * x**2 + 6*x - 1,
    -24 * x**3 + 36 * x**2 - 14*x + 1,
    -100 * x**4 + 200 * x**3 - 126 * x**2 + 26*x - 1,
    -420 * x**5 + 1050 * x**4 - 920 * x**3 + 330 * x**2 - 42*x + 1,
])
