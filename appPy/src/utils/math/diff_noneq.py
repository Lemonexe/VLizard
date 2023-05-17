import numpy as np


# the pivotal part of diff_noneq, which gets the constants for n-point differential formula for grid 'x_vec' and queried point 'x_query'
# there is not much point in calling this function by itself; see the other ones in this file
def get_diff_noneq_consts(x_vec, x_query):
    x_query = np.float64(x_query)
    x_vec = np.array(x_vec)

    if x_vec.ndim != 1: raise TypeError('x_vec must be a vector with only one dimension')
    if x_query.ndim > 0: raise TypeError('x_query must be a float')

    n_x = x_vec.shape[0]
    if n_x < 2: raise ValueError('x_vec must have at least two members')

    # construct the set of n_x linear equations as A @ C = b
    A = np.ones((n_x, n_x), dtype='float64')
    b = np.zeros((n_x, 1), dtype='float64')
    for i in range(1, n_x):
        A[i, :] = x_vec**i
        b[i] = i * x_query**(i - 1)

    # and solve for C, the desired constants
    return np.linalg.solve(A, b).T


# get approximate dy/dx at 'x_query' point with a non-equidistant grid 'x_vec' (1,n) and y values 'y_vec' (m,n)
# 'x_vec' is row vector with length 'n' (only one independent variable)
# 'y_vec' must have same length but can be 'm' rows (each is one dependent variable)
def diff_noneq(x_vec, y_vec, x_query):
    x_query = np.float64(x_query)
    x_vec = np.array(x_vec)
    y_vec = np.array(y_vec)

    C = get_diff_noneq_consts(x_vec, x_query)

    n_x = x_vec.shape[0]
    n_y = y_vec.shape[0] if y_vec.ndim == 1 else y_vec.shape[1]
    if n_x != n_y: raise ValueError(f'number of members for x_vec & y_vec must match (got {n_x}, {n_y})')

    return np.sum(C * y_vec, 1)


# 'diff_noneq' wrapper which vectorizes it, returns diffs as (m, q)
# where m is independent variables in y_vec, q is queried points in 'x_query_vec'
def diffs_noneq(x_vec, y_vec, x_query_vec):
    x_vec = np.array(x_vec)
    y_vec = np.array(y_vec)
    x_query_vec = np.array(x_query_vec)

    is_y_1dim = y_vec.ndim == 1
    if is_y_1dim:
        y_vec = y_vec[:, np.newaxis].T

    if x_query_vec.ndim != 1: raise TypeError('x_query_vec must be a vector with only one dimension')
    q = x_query_vec.shape[0]
    m = y_vec.shape[0]

    diffs = np.zeros([m, q], dtype='float64')

    for i in range(q):
        diffs[:, i] = diff_noneq(x_vec, y_vec, x_query_vec[i])

    # if the input 'y_vec' was a vector, return as vector
    return diffs[0, :] if is_y_1dim else diffs


# 'diff_noneq' wrapper which limits the formula to three closest points
# but only for the special case when 'x_vec' are also the queried points
# this assumes the data is sorted!
def diffs_noneq_3(x_vec, y_vec):
    x_vec = np.array(x_vec)
    y_vec = np.array(y_vec)

    is_y_1dim = y_vec.ndim == 1
    if is_y_1dim:
        y_vec = y_vec[:, np.newaxis].T

    q = x_vec.shape[0]
    m = y_vec.shape[0]

    if q < 3: raise ValueError('x_vec must have at least 3 members')

    diffs = np.zeros([m, q], dtype='float64')

    # foreach point calculate differential using the same method, but always feed a different triplet of points from the grid 'x_vec'
    for (i, x_i) in enumerate(x_vec):
        if i == 0:
            diffs[:, i] = diff_noneq(x_vec[:3], y_vec[:, :3], x_i)
        elif i == len(x_vec) - 1:
            diffs[:, i] = diff_noneq(x_vec[(i - 2):], y_vec[:, (i - 2):], x_i)
        else:
            diffs[:, i] = diff_noneq(x_vec[(i - 1):(i + 2)], y_vec[:, (i - 1):(i + 2)], x_i)

    # if the input 'y_vec' was a vector, return as vector
    return diffs[0, :] if is_y_1dim else diffs
