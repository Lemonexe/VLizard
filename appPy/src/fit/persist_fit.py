import os
from src.utils.io.yaml import open_yaml, save_yaml
from src.utils.Result import cast_to_jsonable_recursive
from src.utils.systems import get_all_system_dir_names, get_system_path, parse_system_dir_name
from .Fit import supported_model_names

# generate json analysis directory path & file name for given system
get_analysis_dir_path = lambda compound1, compound2: os.path.join(get_system_path(compound1, compound2), 'analysis')
get_yaml_filename = lambda name: f'{name}.yaml'


def get_all_persisted_fits():
    """Return all persisted fits of thermodynamic VLE models."""
    system_dir_names = get_all_system_dir_names()
    payload = {key: {} for key in system_dir_names}
    for system_dir_name in system_dir_names:
        analysis_dir_path = get_analysis_dir_path(*parse_system_dir_name(system_dir_name))
        if not os.path.isdir(analysis_dir_path): continue
        for model_name in supported_model_names:
            file_path = os.path.join(analysis_dir_path, get_yaml_filename(model_name))
            if os.path.exists(file_path):
                payload[system_dir_name][model_name] = open_yaml(file_path)
    return payload


def persist_fit(fit):
    zip_params = lambda params: dict(zip(fit.model.param_names, params))
    payload = {
        'input': {
            'datasets': fit.dataset_names,
            'params0': zip_params(fit.params0),
            'const_param_names': fit.const_param_names
        },
        'results': {
            'result_params': zip_params(fit.params),
            'resid_final': fit.resid_final
        }
    }
    payload = cast_to_jsonable_recursive(payload)
    analysis_dir_path = get_analysis_dir_path(fit.compound1, fit.compound2)
    if not os.path.isdir(analysis_dir_path): os.makedirs(analysis_dir_path)
    file_path = os.path.join(analysis_dir_path, get_yaml_filename(fit.model.name))
    save_yaml(payload, file_path, save_format='yaml')


def delete_persisted_fit(compound1, compound2, model_name):
    """
    Delete a specific persisted fit.

    compound1, compound2 (str): names of compounds in the system
    model_name (str): name of model
    """
    file_path = os.path.join(get_analysis_dir_path(compound1, compound2), get_yaml_filename(model_name))
    if os.path.exists(file_path): os.remove(file_path)
