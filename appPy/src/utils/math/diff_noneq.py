import numpy as np
from numpy.linalg import solve


# the pivotal part of diff_noneq
def get_diff_noneq_consts(x_vec, x_query):
    x_query = np.float64(x_query)
    x_vec = np.array(x_vec)
    n_x = x_vec.shape[0]

    if x_vec.ndim > 1:
        raise ValueError('x_vec must be a vector with only one dimension')
    if x_query.ndim > 0:
        raise ValueError('x_query must be a float')

    A = np.ones((n_x, n_x), dtype='float64')
    b = np.zeros((n_x, 1), dtype='float64')
    for i in range(1, n_x):
        A[i, :] = x_vec**i
        b[i] = i * x_query**(i - 1)
    return solve(A, b).T


# get approximate dy/dx at x_query on a non-equidistant grid x_vec (1,n) with y values y_vec (m,n)
# x_vec is row vector with length 'n' (only one independent variable)
# y_vec must have same length but can be 'm' rows (each is one dependent variable)
def diff_noneq(x_vec, y_vec, x_query):
    x_query = np.float64(x_query)
    x_vec = np.array(x_vec)
    y_vec = np.array(y_vec)

    C = get_diff_noneq_consts(x_vec, x_query)

    n_x = x_vec.shape[0]
    n_y = y_vec.shape[0] if y_vec.ndim == 1 else y_vec.shape[1]
    if n_x != n_y:
        raise ValueError(f'number of columns for x_vec & y_vec must match (got {n_x}, {n_y})')

    return np.sum(C * y_vec, 1)


# helper to vectorize diff_noneq, returns diffs as (m, q)
# where m is independent variables in y_vec, q is queried points in x_query_vec
def diffs_noneq(x_vec, y_vec, x_query_vec):
    x_vec = np.array(x_vec)
    y_vec = np.array(y_vec)
    x_query_vec = np.array(x_query_vec)

    if x_query_vec.ndim > 1:
        raise ValueError('x_query_vec must be a vector with only one dimension')
    q = x_query_vec.shape[0]
    m = 1 if y_vec.ndim == 1 else y_vec.shape[0]

    diffs = np.zeros([m, q], dtype='float64')

    for i in range(q):
        diffs[:, i] = diff_noneq(x_vec, y_vec, x_query_vec[i])

    return diffs if y_vec.ndim > 1 else diffs[0, :]
