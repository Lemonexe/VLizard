import os
import numpy as np
from .open_tsv import open_tsv
from .get_system_name import get_system_name


# helper to get directory path where data is stored for the given compounds system dir, and raise ValueError if not exists
def get_system_path(compound1, compound2):
    system_name = get_system_name(compound1, compound2)
    system_dir_path = os.path.join('data', system_name)
    if not os.path.exists(system_dir_path):
        raise ValueError(f'ERROR: the system {system_name} does not exist in your data!')
    return system_dir_path


# for the given system code, get collection of available dataset names
def list_VLE_tables(compound1, compound2):
    system_dir_path = get_system_path(compound1, compound2)

    name_map = []

    for filename in os.listdir(system_dir_path):
        if filename.endswith('.tsv'):
            name_map.append(filename.replace('.tsv', ''))

    return name_map


# get specific dataset as a np matrix with columns p/kPa, T/K, x1, y1
def get_VLE_table(compound1, compound2, dataset):
    system_dir_path = get_system_path(compound1, compound2)
    filename = dataset + '.tsv'

    table = open_tsv(os.path.join(system_dir_path, filename))
    table = np.array(table[1:], dtype='float64')

    return table
