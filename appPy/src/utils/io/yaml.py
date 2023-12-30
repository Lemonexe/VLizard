import json
import yaml
import numpy as np


def cast_to_jsonable(value):
    """Cast value for json serialization."""
    if isinstance(value, np.ndarray): return value.tolist()
    if np.isscalar(value) and hasattr(value, 'item'):
        return value.item()
    return value


def open_yaml(file_path, encoding='utf-8'):
    """
    Open YAML or JSON file, return as dict or None for non-existent file.
    JSON is a subset of YAML so no need to distinguish between the two.

    file_path (str): exact path to json file
    encoding (str): file encoding, default 'utf-8'

    return (dict or None): parsed json file content if found, else None
    """
    try:
        with open(file_path, mode='r', encoding=encoding) as file:
            return yaml.safe_load(file)
    except FileNotFoundError:
        return None


def save_yaml(payload, file_path, save_format='json', encoding='utf-8'):
    """
    Save dict into json file.

    payload (dict): jsonable dict to be saved into file
    file_path (str): exact path to json file
    format (str): file format either 'json' or 'yaml', default 'json'
    encoding (str): file encoding, default 'utf-8'
    """
    with open(file_path, mode='w', encoding=encoding) as file:
        if save_format == 'json':
            # although yaml.dump can also be configured to dump json, the built-in json is safer with numpy values
            json.dump(payload, file, indent=None, separators=(',', ':'), ensure_ascii=False)
        elif save_format == 'yaml':
            yaml.dump(payload, file, default_flow_style=False)
        else:
            raise ValueError(f'Unknown format: {save_format}')
