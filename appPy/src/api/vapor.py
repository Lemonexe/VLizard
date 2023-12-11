from flask import Blueprint
# from src.TD.Vapor import Vapor
from src.utils.compounds import get_compound_names, get_preferred_vapor_model

vapor_blueprint = Blueprint('Vapor', __name__, url_prefix='/vapor')


@vapor_blueprint.get('/')
def get_vapor_models():
    """Return all compounds with their vapor pressure models."""

    def process_preferred_model(compound_name):
        """Return dict entries of compound_name: preferred vapor pressure model."""
        model, T_min, T_max, params = get_preferred_vapor_model(compound_name)
        return compound_name, {
            'model_name': model.name,
            'param_names': model.param_names,
            'T_min': T_min,
            'T_max': T_max,
            'params': params,
        }

    compound_names = get_compound_names()
    payload = dict([process_preferred_model(compound_name) for compound_name in compound_names])
    return payload
