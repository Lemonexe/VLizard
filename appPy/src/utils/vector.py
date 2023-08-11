import numpy as np


# pick part of vector by list of indices, and the rest
def pick_vector(vec, idxs):
    vec = np.array(vec)
    idxs = np.array(idxs)

    if len(idxs) > len(vec):
        raise ValueError(f'length of idxs ({len(idxs)}) must be less than length of vec ({len(vec)})')
    if len(idxs) == 0: return np.array([]), vec

    mask = np.zeros(len(vec), dtype=bool)
    mask[idxs] = True
    picked = vec[mask]
    rest = vec[~mask]
    return picked, rest


# merge two vectors given a list of indices of first vector in the whole, while the other vector fills the remaining space
def overlay_vectors(vec_1, idxs_1, vec_2):
    vec_1 = np.array(vec_1)
    idxs_1 = np.array(idxs_1)
    vec_2 = np.array(vec_2)

    if len(vec_1) != len(idxs_1):
        raise ValueError(f'length of vec_1 ({len(vec_1)}) must equal length of idxs_1 ({len(vec_1)})')
    if len(vec_1) == 0: return vec_2

    vec = np.zeros(len(vec_1) + len(vec_2))
    mask_1 = np.zeros(len(vec), dtype=bool)
    mask_1[idxs_1] = True
    vec[mask_1] = vec_1
    vec[~mask_1] = vec_2
    return vec
