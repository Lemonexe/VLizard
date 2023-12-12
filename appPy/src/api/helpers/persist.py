import os
from src.utils.systems import get_system_path
from src.utils.io.yaml import save_yaml

# generate json analysis directory path & file name for given system
get_VLE_analysis_dir_path = lambda compound1, compound2: os.path.join(get_system_path(compound1, compound2), 'analysis')
get_json_filename = lambda name: f'{name}.json'


# currently unused, and analyses are done on demand with no result caching, because the dev work is immense -> deferred
def persist_VLE_analysis(name, compound1, compound2, payload):
    """
    Persist VLE analysis to json file.

    name (str): name of analysis type
    compound1 (str): name of first compound of the system
    compound2 (str): name of second compound of the system
    payload (dict): jsonable analysis result
    """
    analysis_dir_path = get_VLE_analysis_dir_path(compound1, compound2)
    if not os.path.isdir(analysis_dir_path): os.makedirs(analysis_dir_path)
    file_path = os.path.join(analysis_dir_path, get_json_filename(name))
    save_yaml(payload, file_path)
