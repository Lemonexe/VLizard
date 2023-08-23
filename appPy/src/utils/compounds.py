import os
from .errors import AppException
from .io.tsv import open_tsv


# for the given compound code, get vapor pressure model parameters from file
def get_vapor_model_params(compound, model):
    table_path = os.path.join('data', 'ps', model.name + '.tsv')
    table = open_tsv(table_path)

    # find all rows for given compound case-insensitive
    matched_rows = [row for row in table if row[0].lower() == compound.lower()]

    if len(matched_rows) == 0: return None
    if len(matched_rows) > 1:
        raise AppException(f'Multiple {model.name} parameter sets for compound {compound}, only one is permissible!')

    matched_row = matched_rows[0][1:]  # throw out first cell, which is the compound label
    # parse cells and unpack: first two are temp bounds, then model equation parameters
    T_min, T_max, *params = [float(cell) for cell in matched_row if cell]

    if len(params) != model.n_params:
        msg = f'Corrupt {model.name} parameters for compound {compound}, expected {model.n_params} numbers, got {len(params)}'
        raise AppException(msg)

    return T_min, T_max, params
