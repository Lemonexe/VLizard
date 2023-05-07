import os
import numpy as np
from src.utils.open_tsv import open_tsv


# for the given system code, get tuple of list of datasets, and corresponding name map of datasets
# each dataset is a np matrix with columns p/kPa, T/K, x1, y1
def get_VLE_data(system):
    system_dir_path = os.path.join('data', system)
    if not os.path.exists(system_dir_path):
        raise ValueError(f'the system {system} does not exist in your data!')

    VLE_data = []
    name_map = []

    for filename in os.listdir(system_dir_path):
        if filename.endswith('.tsv'):
            table = open_tsv(os.path.join(system_dir_path, filename))
            table = np.array(table[1:], dtype='float64')

            name_map.append(filename.replace('.tsv', ''))
            VLE_data.append(table)

    return (VLE_data, name_map)
