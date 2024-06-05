import pytest
from .datasets import get_all_dataset_names, parse_datasets, do_datasets, validate_dataset, get_dataset_VLE_data
from .errors import AppException

# NOTE: these tests rely on the files in appPy\data\VLE\test1-test2
# so we mock to use testing data instead of real userdata files
compound1 = 'test1'
compound2 = 'test2'
all_datasets = ['atm', 'pres', 'vac']


def test_get_all_dataset_names(mocker):
    mocker.patch('src.utils.io.local_files.data_folder_path', 'data')
    assert get_all_dataset_names(compound1, compound2) == all_datasets


def test_parse_datasets(mocker):
    mocker.patch('src.utils.io.local_files.data_folder_path', 'data')

    dataset_names = parse_datasets(compound1, compound2, None)
    assert dataset_names == all_datasets

    dataset_names = parse_datasets(compound1, compound2, 'pres,vac')
    assert dataset_names == ['pres', 'vac']

    dataset_names = parse_datasets(compound1, compound2, ['pres', 'vac'])
    assert dataset_names == ['pres', 'vac']

    # dataset string that parses to empty list
    with pytest.raises(AppException):
        parse_datasets(compound1, compound2, '   ,,')
    with pytest.raises(AppException):
        parse_datasets(compound1, compound2, [])

    # test that datasets are validated (raise in validate_dataset)
    with pytest.raises(AppException):
        parse_datasets(compound1, compound2, 'atm,nonsense')


def test_do_datasets(mocker):
    mocker.patch('src.utils.io.local_files.data_folder_path', 'data')

    recorded_datasets = []

    def do_for_datasets(_c1, _c2, _d):
        recorded_datasets.append(_d)

    # test that callback is executed for each dataset. Even with swapped order it should work
    do_datasets(compound2, compound1, 'atm', do_for_datasets)
    assert recorded_datasets == ['atm']

    with pytest.raises(AppException):
        do_datasets(compound1, 'nonsense', None, do_for_datasets)


# pure function using supplied array of datasets, no file system side effects
def test_validate_dataset():
    # returns void, just test that it does not raise
    validate_dataset(compound1, compound2, 'atm', all_datasets)

    with pytest.raises(AppException):
        validate_dataset(compound1, compound2, 'nonsense', all_datasets)


def test_get_dataset_VLE_table(mocker):
    mocker.patch('src.utils.io.local_files.data_folder_path', 'data')

    (p, T, x_1, y_1) = get_dataset_VLE_data(compound1, compound2, 'atm')
    assert (p == 101.325).all()
    assert x_1[0] == 0.1
    assert x_1[-1] == 0.9
    assert T[0] == 350
    assert len(p) == len(T) == len(x_1) == len(y_1) == 9
