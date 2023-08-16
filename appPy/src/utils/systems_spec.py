import pytest
import os
from .systems import validate_system_or_swap, get_system_path
from .errors import AppException

# NOTE: this test relies on the existence of the test system in data/VLE
compound1 = 'test1'
compound2 = 'test2'


def test_validate_system_or_swap():
    # correct order
    assert validate_system_or_swap(compound1=compound1, compound2=compound2) == (compound1, compound2)

    # swapped order
    assert validate_system_or_swap(compound1=compound2, compound2=compound1) == (compound1, compound2)

    with pytest.raises(AppException):
        validate_system_or_swap('nonsense', 'nonsense')


def test_get_system_path():
    file_path = os.path.join('data', 'VLE', 'benzene-toluene')
    assert get_system_path('benzene', 'toluene') == file_path
