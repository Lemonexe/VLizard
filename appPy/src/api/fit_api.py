from flask import Blueprint, request
from src.plot.Fit_VLE_plot import Fit_VLE_plot
from src.plot.Fit_Vapor_plot import Fit_Vapor_plot
from src.plot.VLE_Tabulation_plot import VLE_Tabulation_plot
from src.fit.persist_fit import get_all_persisted_fits, persist_fit, delete_persisted_fit, get_persisted_fit_with_model
from .helpers.schema_validation import unpack_request_schema

fit_blueprint = Blueprint('Fit', __name__, url_prefix='/fit')


@fit_blueprint.get('/vle')
def get_VLE_fits_api():
    """Get all persisted fits of thermodynamic VLE models."""
    return get_all_persisted_fits()


@fit_blueprint.post('/vle')
def fit_VLE_api():
    """Fit VLE data with a thermodynamic model, and return the regression analysis."""
    param_schema = {
        'compound1': True,
        'compound2': True,
        'model_name': True,
        'datasets': True,
        'nparams0': False,
        'const_param_names': False,
        'skip_optimization': False
    }

    params = unpack_request_schema(request, param_schema)
    skip_optimization = params.pop('skip_optimization')  # do not pass that to Fit

    # perform fit, persist, enumerate
    fit = Fit_VLE_plot(*params.values())
    if not skip_optimization:
        fit.optimize()
        persist_fit(fit)
    fit.tabulate()
    payload = fit.serialize()

    # populate payload with SVG plots
    xy_plots = fit.plot_xy_model(mode='svg')
    Txy_plots = fit.plot_Txy_model(mode='svg')
    gamma_plots = fit.plot_gamma_model(mode='svg')
    for (ds, xy, Txy, gamma) in zip(payload['tabulated_datasets'], xy_plots, Txy_plots, gamma_plots):
        ds['xy_plot'] = xy
        ds['Txy_plot'] = Txy
        ds['gamma_plot'] = gamma

    return payload


@fit_blueprint.post('/vapor')
def fit_Vapor_api():
    params_schema = {
        'compound': True,
        'model_name': True,
        'p_data': True,
        'T_data': True,
        'nparams0': False,
        'skip_T_p_optimization': False
    }
    params = unpack_request_schema(request, params_schema)

    fit = Fit_Vapor_plot(*params.values())
    fit.optimize_p()
    if not params['skip_T_p_optimization']: fit.optimize_T_p()
    payload = fit.serialize()
    fit.tabulate()
    payload['plot_p'] = fit.plot_p(mode='svg')
    payload['plot_T_p'] = fit.plot_T_p(mode='svg')
    return payload


@fit_blueprint.delete('/vle')
def delete_VLE_fit_api():
    """Delete a specific persisted fit."""
    schema = {'compound1': True, 'compound2': True, 'model_name': True}
    params = unpack_request_schema(request, schema)
    delete_persisted_fit(*params.values())
    return "OK"


@fit_blueprint.post('/vle/tabulate')
def fit_VLE_tabulate_api():
    """Tabulate existing VLE fitting at given pressure."""
    param_schema = {'compound1': True, 'compound2': True, 'model_name': True, 'p': True}
    params = unpack_request_schema(request, param_schema)

    pfit, model = get_persisted_fit_with_model(params['compound1'], params['compound2'], params['model_name'])
    nparams = pfit['results']['nparams']
    model_params = [nparams[key] for key in model.param_names]

    label = f'{params["p"]} kPa'
    tab = VLE_Tabulation_plot(model, model_params, params['compound1'], params['compound2'], label, params['p'])
    payload = tab.serialize()
    payload['xy_plot'] = tab.plot_xy(mode='svg'),
    payload['Txy_plot'] = tab.plot_Txy(mode='svg'),
    payload['gamma_plot'] = tab.plot_gamma(mode='svg')
    return payload
