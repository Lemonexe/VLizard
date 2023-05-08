import numpy as np
from src.utils.open_tsv import open_tsv
from src.config import antoine_bounds_rel_tol


# for the given compound code, get tuple of Antoine function as lambda T, T_min of data, T_max of data
def get_antoine(compound):
    consts = open_tsv('data/Antoine.tsv')
    matches = list(filter(lambda row: len(row) > 0 and row[0] == compound, consts))

    if len(matches) == 0:
        raise ValueError(f'Zero matches for {compound}!')
    if len(matches) > 1:
        raise ValueError(f'Multiple data found for {compound}, only one Antoine definition is permissible!')

    C1, C2, C3, T_min, T_max = map(float, matches[0][1:])

    return (lambda T: np.exp(C1 + C2 / (T+C3)), T_min, T_max)


# wrapper for get_antoine that checks if queried T_min, T_max fall within the Antoine T_min, T_max (with tolerance)
# gets (antoine_fun as lambda T, warnings[])
def get_antoine_and_warn(compound, T_min_query, T_max_query):
    warnings = []
    (antoine_fun, T_min, T_max) = get_antoine(compound)

    template = 'T extrapolation of Antoine function for {compound}: dataset {what} T is {T_query}, while Antoine {what} T is {T_ant}'
    if T_min_query < T_min - antoine_bounds_rel_tol * (T_max-T_min):
        warnings.append(template.format(what='min', compound=compound, T_query=T_min_query, T_ant=T_min))
    if T_max_query > T_max + antoine_bounds_rel_tol * (T_max-T_min):
        warnings.append(template.format(what='max', compound=compound, T_query=T_max_query, T_ant=T_max))

    return (antoine_fun, warnings)
