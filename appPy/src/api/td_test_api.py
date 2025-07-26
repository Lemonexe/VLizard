from flask import Blueprint, request
from src.plot.Gamma_plot import Gamma_plot
from src.plot.Slope_plot import Slope_plot
from src.plot.Redlich_Kister_plot import Redlich_Kister_plot
from src.TD.Herington_test import Herington_test
from src.plot.Fredenslund_plot import Fredenslund_plot
from src.plot.Van_Ness_plot import Van_Ness_plot
from .helpers.schema_validation import unpack_request_schema

td_test_blueprint = Blueprint('TD', __name__, url_prefix='/td_test')

common_schema = {'compound1': True, 'compound2': True, 'dataset': True}


@td_test_blueprint.post('/gamma')
def gamma_test_api():
    """Perform gamma test & return analysis result for given system and a single dataset."""
    schema = dict(common_schema, const_param_names=True, c_12=False)
    params = unpack_request_schema(request, schema)
    gamma = Gamma_plot(*params.values())
    payload = gamma.serialize()
    payload['plot_gamma'] = gamma.plot_gamma_model(mode='svg')
    payload['plot_phi'] = gamma.plot_phi_model(mode='svg')
    return payload


@td_test_blueprint.post('/slope')
def slope_test_api():
    """Perform slope test & return analysis result for given system and a single dataset."""
    params = unpack_request_schema(request, common_schema)
    slope = Slope_plot(*params.values())
    payload = slope.serialize()
    payload['plot_residuals'] = slope.plot_residuals(mode='svg')
    payload['plot_derivations'] = slope.plot_derivations(mode='svg')
    return payload


@td_test_blueprint.post('/rk')
def rk_test_api():
    """Perform Redlich-Kister test & return analysis result for given system and a single dataset."""
    params = unpack_request_schema(request, common_schema)
    rk = Redlich_Kister_plot(*params.values())
    payload = rk.serialize()
    payload['plot'] = rk.plot(mode='svg')
    return payload


@td_test_blueprint.post('/herington')
def herington_test_api():
    """Perform Herington test & return analysis result for given system and a single dataset."""
    params = unpack_request_schema(request, common_schema)
    payload = Herington_test(*params.values()).serialize()
    return payload


@td_test_blueprint.post('/fredenslund')
def fredenslund_test_api():
    """Perform Fredenslund test & return analysis result for given system, a single dataset and optionally the order of Legendre polynomials."""
    schema = dict(common_schema, legendre_order=False)
    params = unpack_request_schema(request, schema)
    fredenslund = Fredenslund_plot(*params.values())
    payload = fredenslund.serialize()
    payload['plot_g_E'] = fredenslund.plot_g_E(mode='svg')
    payload['plot_p_res'] = fredenslund.plot_p_res(mode='svg')
    payload['plot_y_1_res'] = fredenslund.plot_y_1_res(mode='svg')
    return payload


@td_test_blueprint.post('/van_ness')
def van_ness_test_api():
    """Perform van Ness test & return analysis result for given system and a single dataset."""
    schema = dict(common_schema, model_name=True)
    params = unpack_request_schema(request, schema)
    vn = Van_Ness_plot(*params.values())
    payload = vn.serialize()
    payload['plot'] = vn.plot(mode='svg')
    return payload
