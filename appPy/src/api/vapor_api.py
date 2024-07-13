from flask import Blueprint, request
from werkzeug.exceptions import BadRequest
from src.TD.Vapor import Vapor
from src.plot.Vapor_plot import Vapor_plot
from src.utils.compounds import get_compound_names, get_preferred_vapor_model, amend_model_table, delete_compound
from src.TD.vapor_models.supported_models import supported_models
from .helpers.schema_validation import unpack_request_schema

vapor_blueprint = Blueprint('Vapor', __name__, url_prefix='/vapor')


@vapor_blueprint.get('')
def get_vapor_models_api():
    """Return all compounds with their vapor pressure models."""

    def process_preferred_model(compound_name):
        """Serialize vapor model for a compound to dict."""
        model, T_min, T_max, params = get_preferred_vapor_model(compound_name)
        return {
            'compound': compound_name,
            'model_name': model.name,
            'nparams': dict(zip(model.param_names, params)),
            'T_min': T_min,
            'T_max': T_max,
        }

    compound_names = get_compound_names()
    payload = [process_preferred_model(compound_name) for compound_name in compound_names]
    sorted_payload = sorted(payload, key=lambda x: x['compound'])
    return sorted_payload


@vapor_blueprint.get('/definitions')
def get_vapor_model_definitions_api():
    """Return all supported Vapor_Model definitions."""
    payload = [model.serialize() for model in supported_models]
    return payload


@vapor_blueprint.post('/analysis')
def vapor_analysis_api():
    """Return result of vapor pressure analysis for given compound."""
    schema = {'compound': True}
    params = unpack_request_schema(request, schema)
    compound = params['compound']
    vapor = Vapor_plot(compound)
    payload = vapor.serialize()
    payload['plot'] = vapor.plot(mode='svg')
    return payload


@vapor_blueprint.post('/query')
def vapor_query_api():
    """Return result of quick query for a vapor pressure point for given compound."""
    schema = {'compound': True, 'T': False, 'p': False}
    params = unpack_request_schema(request, schema)
    compound, T, p = params['compound'], params.get('T'), params.get('p')
    vapor = Vapor(compound)
    if T: return {'T': T, 'p': vapor.ps_fun(T)}
    if p: return {'T': vapor.get_T_boil(p), 'p': p}
    raise BadRequest('Either T or p must be provided.')


@vapor_blueprint.put('')
def amend_table_api():
    """Amend vapor pressure model table with given data."""
    schema = {'model_name': True, 'compound': True, 'T_min': True, 'T_max': True, 'nparams': True}
    params = unpack_request_schema(request, schema)
    amend_model_table(*params.values())
    return "OK"


@vapor_blueprint.delete('')
def delete_compound_api():
    """Delete compound from vapor pressure model table."""
    schema = {'model_name': True, 'compound': True}
    params = unpack_request_schema(request, schema)
    delete_compound(*params.values())
    return "OK"
