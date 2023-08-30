import pytest
import os
import numpy as np
from .tsv import open_tsv, matrix2tsv, save_matrix2tsv


def test_matrix2tsv():
    # integer matrices of various shapes
    assert matrix2tsv([[1, 2, 3, 4]]) == '1\t2\t3\t4'
    assert matrix2tsv([[1], [2], [3], [4]]) == '1\n2\n3\n4'
    assert matrix2tsv([[1, 2, 3], [4, 5, 6], [111, 0, 9999]]) == '1\t2\t3\n4\t5\t6\n111\t0\t9999'

    # other types of matrix
    assert matrix2tsv(np.array([[1, 2], [3, 4]])) == '1\t2\n3\t4'
    assert matrix2tsv([['a', 'b', 'c']]) == 'a\tb\tc'
    assert matrix2tsv([[True, False]]) == 'True\tFalse'

    # with headlines
    assert matrix2tsv([[1, 2], [3, 4]], headlines=['x', 'y_n']) == 'x\ty_n\n1\t2\n3\t4'

    # format spec with matrix of float
    assert matrix2tsv([[1 / 3, 7.7e7], [8.8e-8, 3.1]], format_spec='{:6.3g}') == ' 0.333\t7.7e+07\n8.8e-08\t   3.1'

    with pytest.raises(ValueError):
        matrix2tsv([])
    with pytest.raises(ValueError):
        matrix2tsv([[], []])
    with pytest.raises(ValueError):
        matrix2tsv([[1, 2], [3]])
    with pytest.raises(ValueError):
        matrix2tsv([[1, 2], [3, 4]], headlines=['column1'])


def test_tsv_files():
    M = [[1, 2], [3, 4]]
    headlines = ['a', 'b']
    file_path = 'test_file.tsv'

    # save file and test exact contents of file
    save_matrix2tsv(M, file_path, headlines)
    with open(file_path, encoding='utf-8') as tsv_file:
        assert tsv_file.read() == 'a\tb\n1\t2\n3\t4\n'

    # parse file, cast matrix to floats and test that output matches original input
    headlines_out, *M_out = open_tsv(file_path)
    M_out = [[float(cell) for cell in row] for row in M_out]
    assert headlines == headlines_out
    assert M == M_out

    # cleanup the test file
    os.remove(file_path)
