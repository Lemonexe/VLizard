from flask import Blueprint, request
from src.fit.Fit import Fit
from .helpers.schema_validation import unpack_request_schema

fit_blueprint = Blueprint('Fit', __name__, url_prefix='/fit')


@fit_blueprint.post('/VLE')
def fit_VLE_api():
    """Return result of fitting VLE data with a thermodynamic model."""
    param_schema = {
        'compound1': True,
        'compound2': True,
        'model_name': True,
        'datasets': True,
        'params0': False,
        'const_param_names': False,
        'skip_optimization': False
    }
    params_to_pass = 'compound1', 'compound2', 'model_name', 'datasets', 'params0', 'const_param_names'

    params = unpack_request_schema(request, param_schema)
    fit = Fit(*[params[name] for name in params_to_pass])
    if not params['skip_optimization']: fit.optimize()
    fit.tabulate()
    payload = fit.serialize()
    return payload
