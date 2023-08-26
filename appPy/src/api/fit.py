from flask import Blueprint, request
from src.fit.Fit import Fit
from .schema_validation import unpack_request_schema

fit_blueprint = Blueprint('Fit', __name__, url_prefix='/fit')


@fit_blueprint.post('/VLE')
def fit_VLE_api():
    param_schema = {
        'compound1': True,
        'compound2': True,
        'model_name': True,
        'datasets': True,
        'params0': False,
        'const_param_names': False
    }
    params = unpack_request_schema(request, param_schema)
    fit = Fit(*params)
    # fit.tabulate()
    return fit.serialize()
