from flask import Blueprint, request
from src.TD.Vapor import Vapor
from src.utils.compounds import get_compound_names, get_preferred_vapor_model, amend_model_table, delete_compound
from .helpers.schema_validation import unpack_request_schema

vapor_blueprint = Blueprint('Vapor', __name__, url_prefix='/vapor')


@vapor_blueprint.get('')
def get_vapor_models_api():
    """Return all compounds with their vapor pressure models."""

    def process_preferred_model(compound_name):
        """Return dict entries of compound_name: preferred vapor pressure model."""
        model, T_min, T_max, params = get_preferred_vapor_model(compound_name)
        return {
            'compound': compound_name,
            'model_name': model.name,
            'params': dict(zip(model.param_names, params)),
            'T_min': T_min,
            'T_max': T_max,
        }

    compound_names = get_compound_names()
    payload = [process_preferred_model(compound_name) for compound_name in compound_names]
    return payload


@vapor_blueprint.post('/analysis')
def vapor_analysis_api():
    """Return result of vapor pressure analysis for given compound."""
    schema = {'compound': True}
    params = unpack_request_schema(request, schema)
    compound = params['compound']
    payload = Vapor(compound).serialize()
    return payload


@vapor_blueprint.put('')
def amend_table_api():
    """Amend vapor pressure model table with given data."""
    schema = {'model_name': True, 'compound': True, 'T_min': True, 'T_max': True, 'params': True}
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
