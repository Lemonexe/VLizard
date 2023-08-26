from flask import Blueprint, request
from src.TD.Gamma_test import Gamma_test
from src.TD.Slope_test import Slope_test
from src.TD.Redlich_Kister_test import Redlich_Kister_test
from src.TD.Herington_test import Herington_test
from src.TD.Fredenslund_test import Fredenslund_test
from .helpers import unpack_request_or_throw

td_blueprint = Blueprint('TD', __name__, url_prefix='/td_test')

param_keys = ['compound1', 'compound2', 'dataset']


# perform and persist Gamma test for given system and dataset (assumes valid input data)
@td_blueprint.post('/gamma')
def gamma_test_api():
    params = unpack_request_or_throw(request, param_keys)
    return Gamma_test(*params).serialize()


@td_blueprint.post('/slope')
def slope_test_api():
    params = unpack_request_or_throw(request, param_keys)
    return Slope_test(*params).serialize()


@td_blueprint.post('/rk')
def rk_test_api():
    params = unpack_request_or_throw(request, param_keys)
    return Redlich_Kister_test(*params).serialize()


@td_blueprint.post('/herington')
def herington_test_api():
    params = unpack_request_or_throw(request, param_keys)
    return Herington_test(*params).serialize()


@td_blueprint.post('/fredenslund')
def fredenslund_test_api():
    params = unpack_request_or_throw(request, param_keys)
    legendre_order = request.json.get('legendre_order')
    return Fredenslund_test(*params, legendre_order).serialize()
