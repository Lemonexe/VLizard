import os
from .errors import AppException
from .io.tsv import open_tsv, save_matrix2tsv
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


def get_compound_names():
    """Return list of all compound names for which vapor pressure parameters are available."""
    compound_names = set()
    for model in supported_models:
        table_path = os.path.join('data', 'ps', model.name + '.tsv')
        table = open_tsv(table_path)
        compound_names.update([row[0] for row in table[1:]])  # skip header row
    return list(compound_names)


def get_model_and_table(model_name):
    try:
        model = next(model for model in supported_models if model.name == model_name)
    except StopIteration as exc:
        raise AppException(f'Unknown model {model_name}!') from exc
    table_path = os.path.join('data', 'ps', model_name + '.tsv')
    table = open_tsv(table_path)
    return model, table_path, table


def amend_model_table(model_name, compound, T_min, T_max, nparams):
    """
    Add new row to model table, or update existing row.
    If the compound exists in other model table, delete it from there.

    model_name (str): name of model
    compound (str): compound name
    T_min (float): lower temperature bound [K]
    T_max (float): upper temperature bound [K]
    params (list of float): model parameters
    """
    model, table_path, table = get_model_and_table(model_name)

    # validate params
    params = list(nparams.values())
    if len(params) != model.n_params:
        raise AppException(f'Expected {model.n_params} parameters for {model_name}, got {len(params)}!')

    # find all rows for given compound case-insensitive
    matched_rows = [row for row in table if row[0].lower() == compound.lower()]

    if len(matched_rows) == 0:
        new_row = [compound, T_min, T_max, *params]
        table.append(new_row)
    elif len(matched_rows) == 1:
        matched_row = matched_rows[0]
        matched_row[1:] = [T_min, T_max, *params]
    else:
        raise AppException(f'Multiple {model_name} parameter sets for compound {compound}, only one is permissible!')

    # delete compound from another model table, if it exists there
    try:
        currentModel, *_rest = get_preferred_vapor_model(compound)
        if currentModel.name != model_name: delete_compound(currentModel.name, compound)
    except AppException:
        pass  # not found in any other table

    # and finally, save the table
    save_matrix2tsv(table, table_path)


def delete_compound(model_name, compound):
    """
    Delete row from model table.

    model_name (str): name of model
    compound (str): compound name
    """
    _model, table_path, table = get_model_and_table(model_name)
    table = [row for row in table if row[0].lower() != compound.lower()]
    save_matrix2tsv(table, table_path)
