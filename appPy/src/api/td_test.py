from flask import Blueprint, request
from src.TD.Gamma_test import Gamma_test
from src.TD.Slope_test import Slope_test
from src.TD.Redlich_Kister_test import Redlich_Kister_test
from src.TD.Herington_test import Herington_test
from src.TD.Fredenslund_test import Fredenslund_test
from .schema_validation import unpack_request_schema

td_blueprint = Blueprint('TD', __name__, url_prefix='/td_test')

common_schema = {'compound1': True, 'compound2': True, 'dataset': True}


# perform and persist Gamma test for given system and dataset (assumes valid input data)
@td_blueprint.post('/gamma')
def gamma_test_api():
    params = unpack_request_schema(request, common_schema)
    return Gamma_test(*params).serialize()


@td_blueprint.post('/slope')
def slope_test_api():
    params = unpack_request_schema(request, common_schema)
    return Slope_test(*params).serialize()


@td_blueprint.post('/rk')
def rk_test_api():
    params = unpack_request_schema(request, common_schema)
    return Redlich_Kister_test(*params).serialize()


@td_blueprint.post('/herington')
def herington_test_api():
    params = unpack_request_schema(request, common_schema)
    return Herington_test(*params).serialize()


@td_blueprint.post('/fredenslund')
def fredenslund_test_api():
    schema = dict(common_schema, legendre_order=False)
    params = unpack_request_schema(request, schema)
    return Fredenslund_test(*params).serialize()
