import pytest
import numpy as np
from src.TD.vapor_models.antoine import antoine_model
from .compounds import get_vapor_model_params
from .errors import AppException

# NOTE: this test relies on the existence test parameters in data/ps/Antoine.tsv
compound = 'test'
invalid_compound = 'error'


def test_get_vapor_model_params():
    T_min, T_max, params = get_vapor_model_params(compound, antoine_model)
    assert T_min == 100
    assert T_max == 200
    assert np.allclose(params, [1, 2, 3])

    with pytest.raises(AppException):
        get_vapor_model_params(invalid_compound, antoine_model)
