import pytest
import numpy as np
from .vector import overlay_vectors, pick_vector

# whole vector
all_params = np.array([10, 11, 12, 13, 14, 15, 16, 17, 18, 19])

# vec_1 is all_params at indices idxs, vec_2 is the rest
vec_1 = np.array([11, 13, 14, 17])
vec_2 = np.array([10, 12, 15, 16, 18, 19])

# indices of vec_1 in all_params, order does not matter
idxs = np.array([7, 1, 4, 3])


def test_pick_vector():
    picked, rest = pick_vector([9, 8, 7, 6, 5], [1, 3])
    assert np.array_equal(picked, [8, 6])
    assert np.array_equal(rest, [9, 7, 5])

    # it doesn't make sense to duplicate indices, but it is acceptable, they'll be deduplicated
    picked2, rest2 = pick_vector([9, 8, 7, 6, 5], [1, 1, 1, 1, 1, 1, 3, 3])
    assert np.array_equal(picked2, picked)
    assert np.array_equal(rest2, rest)

    picked, rest = pick_vector(all_params, idxs)
    assert np.array_equal(picked, vec_1)
    assert np.array_equal(rest, vec_2)

    # special case where none are picked
    picked, rest = pick_vector(all_params, [])
    assert np.array_equal(picked, np.array([]))
    assert np.array_equal(rest, all_params)

    # there must not be more indices than elements in original vector
    with pytest.raises(ValueError):
        pick_vector([1, 2], all_params)

    # indices must be in bounds of vector
    with pytest.raises(ValueError):
        pick_vector([7, 7, 7], [99])
    with pytest.raises(ValueError):
        pick_vector([7, 7, 7], [-1])


def test_overlay_vector():
    vec = overlay_vectors([90, 80], [2, 4], [1, 2, 3, 4, 5])
    assert np.array_equal(vec, [1, 2, 90, 3, 80, 4, 5])

    vec = overlay_vectors(vec_1, idxs, vec_2)
    assert np.array_equal(vec, all_params)

    vec = overlay_vectors([], [], all_params)
    assert np.array_equal(vec, all_params)

    # size of indices must match the first vector
    with pytest.raises(ValueError):
        overlay_vectors([7, 7, 7], [2, 3], vec_2)

    # indices must be within bounds of newly created vector
    with pytest.raises(ValueError):
        overlay_vectors([7, 7], [1, 8], vec_2)
    with pytest.raises(ValueError):
        overlay_vectors([7], [-1], vec_2)
