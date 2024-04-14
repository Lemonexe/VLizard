import os
from src.utils.io.yaml import open_yaml, save_yaml
from src.utils.Result import cast_to_jsonable_recursive
from src.utils.systems import get_all_system_dir_names, get_system_path, parse_system_dir_name
from .Fit_VLE import supported_model_names

# generate json analysis directory path & file name for given system
get_analysis_dir_path = lambda compound1, compound2: os.path.join(get_system_path(compound1, compound2), 'analysis')
get_yaml_filename = lambda name: f'{name}.yaml'


def get_all_persisted_fits():
    """Return all persisted fits of thermodynamic VLE models."""
    system_dir_names = get_all_system_dir_names()
    payload = []
    for system_dir_name in system_dir_names:
        fits_per_system = []
        analysis_dir_path = get_analysis_dir_path(*parse_system_dir_name(system_dir_name))
        if os.path.isdir(analysis_dir_path):
            for model_name in supported_model_names:
                file_path = os.path.join(analysis_dir_path, get_yaml_filename(model_name))
                if os.path.exists(file_path):
                    fits_per_system.append(open_yaml(file_path))
        payload.append({'system_name': system_dir_name, 'fits': fits_per_system})
    return payload


def persist_fit(fit):
    payload = {
        'model_name': fit.model.name,
        'input': {
            'datasets': fit.dataset_names,
            'nparams0': fit.nparams0,
            'const_param_names': fit.const_param_names
        },
        'results': {
            'nparams': fit.nparams,
            'RMS_final': fit.RMS_final,
            'AAD_final': fit.AAD_final
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
