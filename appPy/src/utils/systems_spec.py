import pytest
from .io.local_files import join_data_path
from .systems import validate_system_or_swap, get_system_path
from .errors import AppException

# NOTE: this test relies on the files in appPy\data\VLE\test1-test2
compound1 = 'test1'
compound2 = 'test2'


def test_validate_system_or_swap(mocker):
    # use testing data instead of real userdata files
    mocker.patch('src.utils.io.local_files.data_folder_path', 'data')

    # correct order
    assert validate_system_or_swap(compound1=compound1, compound2=compound2) == (compound1, compound2)

    # swapped order
    assert validate_system_or_swap(compound1=compound2, compound2=compound1) == (compound1, compound2)

    with pytest.raises(AppException):
        validate_system_or_swap('nonsense', 'nonsense')


# pure function, no file system side effects
def test_get_system_path():
    file_path = join_data_path('VLE', 'benzene-toluene')
    assert get_system_path('benzene', 'toluene') == file_path
