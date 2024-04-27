import os
import numpy as np
from .errors import AppException
from .systems import validate_system_or_swap, get_system_path
from .io.tsv import open_tsv, save_matrix2tsv
from .vector import serialize_cols


def get_all_dataset_names(compound1, compound2):
    """
    Get all datasets of a binary VLE system.
    Assumes valid system in given order.

    compound1, compound2 (str): names of compounds in the system
    return (list(str)): names of all datasets in the system
    """
    system_dir_path = get_system_path(compound1, compound2)
    names = [f.name.replace('.tsv', '') for f in os.scandir(system_dir_path) if f.name.endswith('.tsv')]
    return sorted(names)


def parse_datasets(compound1, compound2, datasets):
    """
    Select some or all datasets for a binary VLE system.
    Assumes valid system in given order.

    compound1, compound2 (str): names of compounds in the system
    datasets (str or list(str)): comma-separated string or list of dataset names
    return (list(str)): names of selected datasets in the system
    """
    all_dataset_names = get_all_dataset_names(compound1, compound2)
    if datasets is None: return all_dataset_names

    if isinstance(datasets, str):
        dataset_names = list(filter(bool, map(lambda name: name.strip(), datasets.split(','))))
    else:
        dataset_names = datasets

    if len(dataset_names) == 0:
        raise AppException('No datasets given! Omit the parameter to list all datasets.')
    for dataset_name in dataset_names:
        validate_dataset(compound1, compound2, dataset_name, all_dataset_names)
    return sorted(dataset_names)


def do_datasets(compound1, compound2, datasets, do_for_dataset):
    """
    Call parse_datasets and fire callback on each valid dataset name.
    Also validates system, may swap compounds order if needed.

    compound1, compound2, datasets...
    do_for_dataset (lambda compound1, compound2, dataset_name): callback function that takes compound1, compound2, dataset_name as parameters
    """
    compound1, compound2 = validate_system_or_swap(compound1, compound2)
    dataset_names = parse_datasets(compound1, compound2, datasets)
    for dataset_name in dataset_names:
        do_for_dataset(compound1, compound2, dataset_name)


def validate_dataset(compound1, compound2, dataset, all_dataset_names):
    """
    Throw if dataset does not exist in the system.

    compound1, compound2 (str): names of compounds in the system
    dataset (str): name of the dataset in question
    all_dataset_names (list(str)): names of all datasets in the system
    """
    if not dataset in all_dataset_names:
        csv = ', '.join(all_dataset_names)
        msg = f'the dataset {dataset} was not found in system {compound1}-{compound2}!\nAvailable datasets: {csv}'
        raise AppException(msg)


expected_headers = ['p/kPa', 'T/K', 'x1', 'y1']


def get_dataset_VLE_data(compound1, compound2, dataset):
    """
    Get the data matrix for a specific dataset.
    Assumes valid system compound1-compound2.

    compound1, compound2 (str): names of compounds in the system
    dataset (str): name of the dataset
    return np.array(4,n): matrix of data with rows p/kPa, T/K, x1, y1 (convenient, because it can be destructured as such)
    """
    system_dir_path = get_system_path(compound1, compound2)
    filename = dataset + '.tsv'

    # first row is headers, rest is numerical data
    headers, *table = open_tsv(os.path.join(system_dir_path, filename))

    for header, expected in zip(headers, expected_headers):
        if header.strip().lower() != expected.lower():
            msg = f'Unprocessable dataset {dataset} of system {compound1}-{compound2}! Table must have headers: {" ".join(expected_headers)}'
            raise AppException(msg)

    # transpose so that rows correspond to p/kPa, T/K, x1, y1
    return np.array(table, dtype='float64').T


def upsert_dataset(compound1, compound2, dataset, p, T, x_1, y_1):
    """
    Create or overwrite a dataset of a binary VLE system, create the system if not exists.
    Assumes system will not be duplicated in given order.
    Data will be sorted by x_1 ascending.

    compound1, compound2 (str): names of compounds in the system
    dataset (str): name of the dataset
    p, T, x_1, y_1 (np.array or list): data vectors (unsorted)
    """
    system_path = get_system_path(compound1, compound2)
    if not os.path.exists(system_path):
        os.makedirs(system_path)
    table_path = os.path.join(system_path, dataset + '.tsv')
    table = serialize_cols(p, T, x_1, y_1)
    idxs_sorted_by_x_1 = np.argsort(table[:, 2])
    table = table[idxs_sorted_by_x_1]
    save_matrix2tsv(table, table_path, expected_headers)


def delete_dataset(compound1, compound2, dataset):
    """
    Delete a dataset of a binary VLE system.
    Assumes valid system in given order.

    compound1, compound2 (str): names of compounds in the system
    dataset (str): name of the dataset
    """
    system_dir_path = get_system_path(compound1, compound2)
    filename = dataset + '.tsv'
    os.remove(os.path.join(system_dir_path, filename))
