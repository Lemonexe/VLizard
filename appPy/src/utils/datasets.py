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


# for a binary system, parse the 'datasets' comma-separated string and return a list of valid dataset names
# assumes valid system compound1-compound2
def parse_datasets(compound1, compound2, datasets):
    all_dataset_names = get_all_dataset_names(compound1, compound2)

    if datasets:
        dataset_names = sorted(list(filter(bool, map(lambda name: name.strip(), datasets.split(',')))))
        if len(dataset_names) == 0:
            raise AppException('No datasets given! Omit the parameter to list all datasets.')
        for dataset_name in dataset_names:
            validate_dataset(compound1, compound2, dataset_name, all_dataset_names)
        return dataset_names
    return all_dataset_names


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
        message = f'the dataset {dataset} was not found in system {compound1}-{compound2}!\nAvailable datasets: {", ".join(all_dataset_names)}'
        raise AppException(message)


# get specific dataset as a np matrix with columns p/kPa, T/K, x1, y1
# assumes valid system compound1-compound2
def get_dataset_VLE_table(compound1, compound2, dataset):
    system_dir_path = get_system_path(compound1, compound2)
    filename = dataset + '.tsv'

    table = open_tsv(os.path.join(system_dir_path, filename))
    return np.array(table[1:], dtype='float64')
