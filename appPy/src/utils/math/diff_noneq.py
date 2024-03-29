import numpy as np


def get_diff_noneq_consts(x_vec, x_query):
    """
    Calculate the constants for n-point derivation formula on non-equidistant grid.
    It is the pivotal part of noneq derivation, but there is not much point in calling it by itself.

    x_vec (np.array(n) or list): the grid as vector of n x points (only one independent variable)
    x_query (float): queried x point, may be outside x_vec
    return (np.array(n)): constants for n-point derivation formula
    """
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


def diff_noneq(x_vec, y_vec, x_query):
    """
    Get approximate derivation at arbitrary point using a non-equidistant grid of x and y values.
    Uses 'get_diff_noneq_consts' to calculate the constants for n-point derivation formula.

    x_vec...
    y_vec (np.array((m,n) or list): matrix of m y variables for n grid points (multiple dependent variables)
    x_query...
    return (np.array(m)): vector of m dy_i/dx values at x_query
    """
    x_query = np.float64(x_query)
    x_vec = np.array(x_vec)
    y_vec = np.array(y_vec)

    C = get_diff_noneq_consts(x_vec, x_query)

    n_x = x_vec.shape[0]
    n_y = y_vec.shape[0] if y_vec.ndim == 1 else y_vec.shape[1]
    if n_x != n_y: raise ValueError(f'number of members for x_vec & y_vec must match (got {n_x}, {n_y})')

    return np.sum(C * y_vec, 1)


def diffs_noneq(x_vec, y_vec, x_query_vec):
    """
    Get approximate derivation at multiple arbitrary points using a non-equidistant grid of x and y values.
    Wrapper for 'diff_noneq' that vectorizes its 'x_query'.
    Currently unused.

    x_vec...
    y_vec...
    x_query (np.array(q)): vector of q queried points x, which may all be outside x_vec
    return (np.array(m, q)): matrix of m dy_i/dx values for each q queried points
    """
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


def diffs_noneq_3(x_vec, y_vec):
    """
    Get approximate derivation at a non-equidistant grid of x and y values for each grid point using only three closest points.
    Wrapper for 'diff_noneq' that calls it for all neighbouring triplets from 'x_vec'.
    Does not allow arbitrary query points due to the complexity of finding the right triplets.
    Assumes the data is sorted!

    x_vec...
    y_vec...

    return (np.array(m, n)): matrix of m dy_i/dx values for each n queried points
    """
    x_vec = np.array(x_vec)
    y_vec = np.array(y_vec)

    is_y_1dim = y_vec.ndim == 1
    if is_y_1dim:
        y_vec = y_vec[:, np.newaxis].T

    n = x_vec.shape[0]
    m = y_vec.shape[0]

    if n < 3: raise ValueError('x_vec must have at least 3 members')

    diffs = np.zeros([m, n], dtype='float64')

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
