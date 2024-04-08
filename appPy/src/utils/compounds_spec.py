import pytest
import numpy as np
from src.TD.vapor_models.Vapor_Model import Vapor_Model
from .compounds import get_vapor_model_params
from .errors import AppException

# NOTE: this test relies on the file data/ps/Test.tsv
compound = 'test'
invalid_compound = 'error'

test_model = Vapor_Model(
    name='Test',
    n_params=3,
    param_names=['A', 'B', 'C'],
    fun=None,
    params0=[1, 2, 3],
)


def test_get_vapor_model_params():
    T_min, T_max, params = get_vapor_model_params(compound, test_model)
    assert T_min == 100
    assert T_max == 200
    assert np.allclose(params, [1, 2, 3])

    with pytest.raises(AppException):
        get_vapor_model_params(invalid_compound, test_model)
