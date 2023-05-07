import numpy as np
from src.utils.open_tsv import open_tsv


# for the given compound code, get tuple of antoine function as lambda T, T_min of data, T_max of data
def get_antoine(compound):
    consts = open_tsv('data/Antoine.tsv')
    matches = list(filter(lambda row: len(row) > 0 and row[0] == compound, consts))

    if len(matches) == 0:
        raise ValueError(f'Zero matches for {compound}')
    if len(matches) > 1:
        raise ValueError(f'Multiple data found for {compound}, only one Antoine definition is permissible')

    C1, C2, C3, T_min, T_max = map(float, matches[0][1:])

    return (lambda T: np.exp(C1 + C2 / (T+C3)), T_min, T_max)
