from flask import Blueprint, request
from werkzeug.exceptions import NotFound
from src.plot.VLE_plot import VLE_plot
from src.utils.systems import get_all_system_dir_names, parse_system_dir_name, delete_system
from src.utils.datasets import get_all_dataset_names, get_dataset_VLE_data, upsert_dataset, delete_dataset
from src.TD.VLE_models.supported_models import supported_models
from src.utils.Result import cast_to_jsonable_recursive
from .helpers.schema_validation import unpack_request_schema

vle_blueprint = Blueprint('VLE', __name__, url_prefix='/vle')


@vle_blueprint.get('')
def get_vle_api():
    """Return all VLE systems and their dataset tables."""
    system_dir_names = get_all_system_dir_names()

    def get_VLE_data_object(compound1, compound2, dataset_name):
        table = cast_to_jsonable_recursive(get_dataset_VLE_data(compound1, compound2, dataset_name))
        VLE_data_object = dict(zip(['p', 'T', 'x_1', 'y_1'], table))
        VLE_data_object['name'] = dataset_name
        return VLE_data_object

    def load_all_tables(dir_name):
        compound1, compound2 = parse_system_dir_name(dir_name)
        dataset_names = get_all_dataset_names(compound1, compound2)
        datasets = [get_VLE_data_object(compound1, compound2, dataset_name) for dataset_name in dataset_names]
        return {'system_name': dir_name, 'datasets': datasets}

    return [load_all_tables(dir_name) for dir_name in system_dir_names]


@vle_blueprint.get('/definitions')
def get_VLE_model_definitions_api():
    """Return all supported VLE_Model definitions."""
    model2dict = lambda model: {
        'name': model.name,
        'nparams0': dict(zip(model.param_names, model.params0)),
        'param_labels': dict(zip(model.param_names, model.param_labels or model.param_names)),
        'is_gamma_T_fun': model.is_gamma_T_fun,
    }
    payload = [model2dict(model) for model in supported_models]
    return payload


@vle_blueprint.post('/analysis')
def vle_analysis_api():
    """Create or update a dataset of a VLE system, create system if not exists."""
    schema = {'compound1': True, 'compound2': True, 'dataset': True}
    params = unpack_request_schema(request, schema)
    vle = VLE_plot(*params.values())
    payload = vle.serialize()
    payload['plot_xy'] = vle.plot_xy(mode='svg')
    payload['plot_Txy'] = vle.plot_Txy(mode='svg')
    payload['plot_gamma'] = vle.plot_gamma(mode='svg')
    return payload


@vle_blueprint.post('')
def upsert_vle_api():
    """Create or update a dataset of a VLE system, create system if not exists."""
    schema = {'compound1': True, 'compound2': True, 'dataset': True, 'p': True, 'T': True, 'x_1': True, 'y_1': True}
    params = unpack_request_schema(request, schema)
    upsert_dataset(*params.values())
    return "OK"


@vle_blueprint.delete('')
def delete_vle_api():
    """Delete specified datasets of a VLE system, or the whole system if not specified."""
    schema = {'compound1': True, 'compound2': True, 'dataset': False}
    params = unpack_request_schema(request, schema)
    try:
        if not params['dataset']:
            delete_system(params['compound1'], params['compound2'])
        else:
            delete_dataset(*params.values())
    except FileNotFoundError as exc:
        raise NotFound from exc
    return "OK"
