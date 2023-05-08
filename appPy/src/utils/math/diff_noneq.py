import numpy as np
from numpy.linalg import solve


# get approximate dy/dx at x_query on a non-equidistant grid x_vec (1,n) with y values y_vec (m,n)
# x_vec is row vector with length 'n' (only one independent variable)
# y_vec must have same length but can be 'm' rows (each is one dependent variable)
def diff_noneq(x_vec, y_vec, x_query):
    x_query = float(x_query)  # does typecheck for scalar

    n = x_vec.shape[0]
    nn = (y_vec.shape[0] if y_vec.ndim == 1 else y_vec.shape[1])
    if n != nn:
        raise ValueError(f'number of columns for x_vec & y_vec must match (got {n}, {y_vec.shape[1]})')

    A = np.ones((n, n), dtype='float64')
    b = np.zeros((n, 1), dtype='float64')
    for i in range(1, n):
        A[i, :] = x_vec**i
        b[i] = i * x_query**(i - 1)
    C = solve(A, b).T

    return np.sum(C * y_vec, 1)


# helper to vectorize diff_noneq, returns diffs as (m, q)
# where m is independent variables in y_vec, q is queried points in x_query_vec
def diffs_noneq(x_vec, y_vec, x_query_vec):
    x_query_vec = np.array(x_query_vec)

    if x_query_vec.ndim > 1:
        raise ValueError('x_vec must be a vector with only one dimension')
    q = x_query_vec.shape[0]
    m = 1 if y_vec.ndim == 1 else y_vec.shape[0]

    diffs = np.zeros([m, q], dtype='float64')

    for i in range(q):
        diffs[:, i] = diff_noneq(x_vec, y_vec, x_query_vec[i])

    return diffs if y_vec.ndim > 1 else diffs[0, :]
