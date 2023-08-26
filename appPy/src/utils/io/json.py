import json
import numpy as np


# cast value so it's acceptable for json serialization
def cast_type_to_jsonable(value):
    if isinstance(value, np.ndarray): return value.tolist()
    if isinstance(value, np.bool_): return bool(value)
    return value


cast_dict_to_jsonable = lambda payload: {key: cast_type_to_jsonable(value) for key, value in payload.items()}


# open json file, return as dict
def open_json(file_path, encoding='utf-8', on_error=None):
    try:
        with open(file_path, mode='r', encoding=encoding) as file:
            return json.load(file)
    except FileNotFoundError:
        return None
    except json.JSONDecodeError as exc:
        if on_error: on_error(exc)
        return None


# save dict into json file
def save_json(payload, file_path, encoding='utf-8', pretty=False, on_error=None):
    indent = 4 if pretty else None
    separators = None if pretty else (',', ':')
    with open(file_path, mode='w', encoding=encoding) as file:
        try:
            payload = cast_dict_to_jsonable(payload)
            json.dump(payload, file, indent=indent, separators=separators, ensure_ascii=False)
        except TypeError as exc:
            if on_error: on_error(exc)
