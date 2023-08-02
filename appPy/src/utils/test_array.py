import pytest
import numpy as np
from .array import serialize_rows, serialize_cols

a = np.array([1, 2, 3, 4])
b = np.array([6, 7, 8, 9])
c = np.array([1, 2, 3])


def test_serialize_rows():
    M = serialize_rows(a, b)
    M_expected = np.array([[1, 2, 3, 4], [6, 7, 8, 9]])
    assert np.array_equal(M, M_expected)

    with pytest.raises(ValueError):
        serialize_rows(a, b, c)


def test_serialize_cols():
    M = serialize_cols(a, b)
    M_expected = np.array([[1, 6], [2, 7], [3, 8], [4, 9]])
    assert np.array_equal(M, M_expected)
