import json
import numpy as np


def cast_type_to_jsonable(value):
    """Cast value so it's acceptable for json serialization."""
    if isinstance(value, np.ndarray): return value.tolist()
    if isinstance(value, np.bool_): return bool(value)
    return value


cast_dict_to_jsonable = lambda payload: {key: cast_type_to_jsonable(value) for key, value in payload.items()}
"""Cast values of dict so it's acceptable for json serialization."""


def open_json(file_path, encoding='utf-8', on_error=None):
    """
    Open json file, return as dict.

    file_path (str): exact path to json file
    encoding (str): file encoding, default 'utf-8'
    on_error (function err => void): callback function to be called on error during json parsing

    return (dict or None): parsed json file content if found, else None
    """
    try:
        with open(file_path, mode='r', encoding=encoding) as file:
            return json.load(file)
    except FileNotFoundError:
        return None
    except json.JSONDecodeError as exc:
        if on_error: on_error(exc)
        return None


def save_json(payload, file_path, encoding='utf-8', pretty=False, on_error=None):
    """
    Save dict into json file.

    payload (dict): jsonable dict to be saved into file
    file_path (str): exact path to json file
    encoding (str): file encoding, default 'utf-8'
    pretty (bool): if True, json will be formatted with spacing
    on_error (function err => void): callback function to be called on error during json parsing
    """
    indent = 4 if pretty else None
    separators = None if pretty else (',', ':')
    with open(file_path, mode='w', encoding=encoding) as file:
        try:
            payload = cast_dict_to_jsonable(payload)
            json.dump(payload, file, indent=indent, separators=separators, ensure_ascii=False)
        except TypeError as exc:
            if on_error: on_error(exc)
