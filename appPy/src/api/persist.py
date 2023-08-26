import os
from src.utils.systems import get_system_path
from src.utils.io.json import save_json

# generate json analysis directory path & file name for given system
get_VLE_analysis_dir_path = lambda compound1, compound2: os.path.join(get_system_path(compound1, compound2), 'analysis')
get_json_filename = lambda name: f'{name}.json'


# persist VLE analysis to json file
def persist_VLE_analysis(name, compound1, compound2, payload):
    analysis_dir_path = get_VLE_analysis_dir_path(compound1, compound2)
    if not os.path.isdir(analysis_dir_path): os.makedirs(analysis_dir_path)
    file_path = os.path.join(analysis_dir_path, get_json_filename(name))
    save_json(payload, file_path)
