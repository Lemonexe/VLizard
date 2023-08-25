from flask import Blueprint, request
from src.TD.Gamma_test import Gamma_test
from .helpers import unpack_request_or_throw

td_blueprint = Blueprint('TD', __name__)


# perform and persist Gamma test for given system and dataset (assumes valid input data)
@td_blueprint.post('/api/gamma_test')
def gamma_test_api():
    data = request.get_json()
    keys = ['compound1', 'compound2', 'dataset']
    compound1, compound2, dataset = unpack_request_or_throw(data, keys)

    gamma_test = Gamma_test(compound1, compound2, dataset)
    return gamma_test.serialize()
