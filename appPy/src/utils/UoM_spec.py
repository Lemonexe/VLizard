import numpy as np
import pytest
from src.config import cst, cfg
from .UoM import convert_T, convert_p


def test_convert_T():
    cfg.UoM_T = 'K'
    assert convert_T(0) == 0
    arr = np.array([273.15, 0, 100 / 7, 473.15, 1e9])
    assert np.sum(abs(convert_T(arr) - arr)) < 1e-8

    cfg.UoM_T = '°c'
    assert convert_T(273.15) == 0
    assert convert_T(cst.C2K) == 0
    arr_expect = arr - cst.C2K
    assert np.sum(abs(convert_T(arr) - arr_expect)) < 1e-8

    cfg.UoM_T = 'what is this unit?'
    with pytest.raises(ValueError):
        convert_T(123)


def test_convert_p():
    cfg.UoM_p = 'KPa'
    assert convert_p(777) == 777
    arr = np.array([1.2345e-6, 50, 23456789])
    assert np.sum(abs(convert_p(arr) - arr)) < 1e-8

    cfg.UoM_p = 'bar'
    assert convert_p(250) == 2.5
    arr_expect = arr * 0.01
    assert np.sum(abs(convert_p(arr) - arr_expect)) < 1e-8

    cfg.UoM_p = 'pa'
    assert convert_p(123) == 123000

    cfg.UoM_p = 'MPA'
    assert convert_p(600) == 0.6

    cfg.UoM_p = 'what is this unit?'
    with pytest.raises(ValueError):
        convert_p(123)
