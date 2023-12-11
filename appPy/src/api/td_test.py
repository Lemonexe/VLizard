from flask import Blueprint, request
from src.TD.Gamma_test import Gamma_test
from src.TD.Slope_test import Slope_test
from src.TD.Redlich_Kister_test import Redlich_Kister_test
from src.TD.Herington_test import Herington_test
from src.TD.Fredenslund_test import Fredenslund_test
from .schema_validation import unpack_request_schema

td_test_blueprint = Blueprint('TD', __name__, url_prefix='/td_test')

common_schema = {'compound1': True, 'compound2': True, 'dataset': True}


@td_test_blueprint.post('/gamma')
def gamma_test_api():
    """Return result of gamma test for given system and a single dataset."""
    params = unpack_request_schema(request, common_schema)
    payload = Gamma_test(*params.values()).serialize()
    return payload


@td_test_blueprint.post('/slope')
def slope_test_api():
    """Return result of slope test for given system and a single dataset."""
    params = unpack_request_schema(request, common_schema)
    payload = Slope_test(*params.values()).serialize()
    return payload


@td_test_blueprint.post('/rk')
def rk_test_api():
    """Return result of Redlich-Kister test for given system and a single dataset."""
    params = unpack_request_schema(request, common_schema)
    payload = Redlich_Kister_test(*params.values()).serialize()
    return payload


@td_test_blueprint.post('/herington')
def herington_test_api():
    """Return result of Herington test for given system and a single dataset."""
    params = unpack_request_schema(request, common_schema)
    payload = Herington_test(*params.values()).serialize()
    return payload


@td_test_blueprint.post('/fredenslund')
def fredenslund_test_api():
    """Return result of Fredenslund test for given system, a single dataset and optionally the order of Legendre polynomials."""
    schema = dict(common_schema, legendre_order=False)
    params = unpack_request_schema(request, schema)
    payload = Fredenslund_test(*params.values()).serialize()
    return payload
