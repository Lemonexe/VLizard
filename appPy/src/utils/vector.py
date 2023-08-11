import numpy as np


# pick part of vector by list of indices, and the rest
def pick_vector(vec, idxs):
    vec = np.array(vec)
    idxs = np.unique(idxs)

    if len(idxs) > len(vec):
        raise ValueError(f'length of idxs ({len(idxs)}) must be less than length of vec ({len(vec)})')
    if len(idxs) == 0: return np.array([]), vec
    if np.max(idxs) >= len(vec) or np.min(idxs) < 0:
        raise ValueError(f'index {np.max(idxs)} out of bounds, max {len(vec)-1}')

    mask = np.zeros(len(vec), dtype=bool)
    mask[idxs] = True
    picked = vec[mask]
    rest = vec[~mask]
    return picked, rest


# merge two vectors given a list of indices of first vector in the whole, while the other vector fills the remaining space
def overlay_vectors(vec_1, idxs_1, vec_2):
    vec_1 = np.array(vec_1)
    idxs_1 = np.unique(idxs_1)
    vec_2 = np.array(vec_2)

    n_new = len(vec_1) + len(vec_2)

    if len(vec_1) != len(idxs_1):
        raise ValueError(f'length of vec_1 ({len(vec_1)}) must equal length of idxs_1 ({len(vec_1)})')
    if len(vec_1) == 0: return vec_2
    if np.max(idxs_1) >= n_new or np.min(idxs_1) < 0:
        raise ValueError(f'index {np.max(idxs_1)} out of bounds, max {n_new-1}')

    vec = np.zeros(n_new)
    mask_1 = np.zeros(len(vec), dtype=bool)
    mask_1[idxs_1] = True
    vec[mask_1] = vec_1
    vec[~mask_1] = vec_2
    return vec
