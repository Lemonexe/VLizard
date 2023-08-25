from flask import Blueprint, request
from src.TD.Gamma_test import Gamma_test
from src.TD.Slope_test import Slope_test
from .helpers import unpack_request_or_throw

td_blueprint = Blueprint('TD', __name__)

keys = ['compound1', 'compound2', 'dataset']

# perform and persist Gamma test for given system and dataset (assumes valid input data)
@td_blueprint.post('/api/gamma_test')
def gamma_test_api():
    compound1, compound2, dataset = unpack_request_or_throw(request, keys)

    return Gamma_test(compound1, compound2, dataset).serialize()

@td_blueprint.post('/api/slope_test')
def slope_test_api():
    compound1, compound2, dataset = unpack_request_or_throw(request, keys)

    return Slope_test(compound1, compound2, dataset).serialize()
