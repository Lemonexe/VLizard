from flask import Blueprint, request
from src.fit.Fit import supported_models
from src.plot.Fit_plot import Fit_plot
from src.fit.persist_fit import get_all_persisted_fits, persist_fit, delete_persisted_fit
from src.utils.io.yaml import cast_to_jsonable
from .helpers.schema_validation import unpack_request_schema

fit_blueprint = Blueprint('Fit', __name__, url_prefix='/fit')


@fit_blueprint.get('')
def get_VLE_fits_api():
    """Get all persisted fits of thermodynamic VLE models."""
    return get_all_persisted_fits()


@fit_blueprint.get('/definitions')
def get_VLE_model_definitions_api():
    """Return all supported VLE_Model definitions."""
    model2dict = lambda model: {
        'name': model.name,
        'params0': cast_to_jsonable(model.params0),
        'param_names': model.param_names,
        'is_gamma_T_fun': model.is_gamma_T_fun,
    }
    payload = [model2dict(model) for model in supported_models]
    return payload


@fit_blueprint.post('')
def fit_VLE_api():
    """Fit VLE data with a thermodynamic model, and return the regression analysis."""
    param_schema = {
        'compound1': True,
        'compound2': True,
        'model_name': True,
        'datasets': True,
        'params0': False,
        'const_param_names': False,
        'skip_optimization': False
    }

    params = unpack_request_schema(request, param_schema)
    skip_optimization = params.pop('skip_optimization')  # do not pass that to Fit

    # perform fit, persist, enumerate
    fit = Fit_plot(*params.values())
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


@fit_blueprint.delete('')
def delete_VLE_fit_api():
    """Delete a specific persisted fit."""
    schema = {'compound1': True, 'compound2': True, 'model_name': True}
    params = unpack_request_schema(request, schema)
    delete_persisted_fit(*params.values())
    return "OK"
