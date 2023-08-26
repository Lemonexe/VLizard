import os
import numpy as np
from .errors import AppException
from .systems import validate_system_or_swap, get_system_path
from .io.tsv import open_tsv


# get datasets of a binary system as a list of strings
# assumes valid system compound1-compound2
def get_all_dataset_names(compound1, compound2):
    system_dir_path = get_system_path(compound1, compound2)
    names = [f.name.replace('.tsv', '') for f in os.scandir(system_dir_path) if f.name.endswith('.tsv')]
    return sorted(names)


# for a binary system, parse the 'datasets' comma-separated string or list and return a list of valid dataset names
# assumes valid system compound1-compound2
def parse_datasets(compound1, compound2, datasets):
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


# wrapper for parse_datasets that fires callback on each valid dataset name
# also validates system, may swap compounds order if needed
def do_datasets(compound1, compound2, datasets, do_for_dataset):
    compound1, compound2 = validate_system_or_swap(compound1, compound2)
    dataset_names = parse_datasets(compound1, compound2, datasets)
    for dataset_name in dataset_names:
        do_for_dataset(compound1, compound2, dataset_name)


# throw if dataset does not exist in the system
# assumes valid system compound1-compound2
def validate_dataset(compound1, compound2, dataset, all_dataset_names):
    if not dataset in all_dataset_names:
        csv = ', '.join(all_dataset_names)
        msg = f'the dataset {dataset} was not found in system {compound1}-{compound2}!\nAvailable datasets: {csv}'
        raise AppException(msg)


expected_headers = ['p/kPa', 'T/K', 'x1', 'y1']


# get specific dataset as a np matrix with rows p/kPa, T/K, x1, y1 (convenient, because it can be destructured as such)
# assumes valid system compound1-compound2
def get_dataset_VLE_data(compound1, compound2, dataset):
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
