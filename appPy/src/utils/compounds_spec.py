import pytest
import numpy as np
from src.TD.vapor_models.Vapor_Model import Vapor_Model
from .compounds import get_vapor_model_params
from .errors import AppException

# NOTE: this test relies on the file appPy\data\ps\Test.tsv
compound_good = 'good'
compound_invalid = 'invalid'
compound_duplicate = 'duplicate'

test_model = Vapor_Model(
    name='Test',
    n_params=3,
    param_names=['A', 'B', 'C'],
    fun=None,
    params0=[1, 2, 3],
)


def test_get_vapor_model_params(mocker):
    # use testing data instead of real userdata files
    mocker.patch('src.utils.io.local_files.data_folder_path', 'data')

    # no such compound in the test file (compound does not exist)
    assert get_vapor_model_params('nonexistent', test_model) is None

    # compound has valid data
    T_min, T_max, params = get_vapor_model_params(compound_good, test_model)
    assert T_min == 100
    assert T_max == 200
    assert np.allclose(params, [1, 2, 3])

    # compound has corrupted data
    with pytest.raises(AppException):
        get_vapor_model_params(compound_invalid, test_model)

    with pytest.raises(AppException):
        get_vapor_model_params(compound_duplicate, test_model)
