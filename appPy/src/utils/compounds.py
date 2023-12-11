import os
from .errors import AppException
from .io.tsv import open_tsv
from src.TD.vapor_models.wagner import wagner_model
from src.TD.vapor_models.antoine import antoine_model

# supported models in order of preference, descending
supported_models = [wagner_model, antoine_model]


def get_preferred_vapor_model(compound):
    """
    For the given compound, find preferred model of vapor pressure.

    compound (str): compound name
    return (tuple): Vapor_Model, T_min [K], T_max [K], *params
    """
    for model in supported_models:
        results = get_vapor_model_params(compound, model)
        if results: return model, *results
    raise AppException(f'No vapor pressure model found for {compound}!')


def get_vapor_model_params(compound, model):
    """
    For the given compound, get parameters of selected vapor pressure model from file.

    compound (str): compound name
    model (Vapor_Model): vapor pressure model instance
    return (tuple): T_min [K], T_max [K], *params
    """
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
