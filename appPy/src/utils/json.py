import json


# open json file, return as dict
def open_json(filepath, encoding='utf-8', on_error=None):
    try:
        with open(filepath, mode='r', encoding=encoding) as file:
            return json.load(file)
    except FileNotFoundError:
        return None
    except json.JSONDecodeError as exc:
        if on_error: on_error(exc)
        return None


# save dict into json file
def save_json(obj, filepath, encoding='utf-8', on_error=None):
    with open(filepath, mode='w', encoding=encoding) as file:
        try:
            json.dump(obj, file, indent=4, sort_keys=True, ensure_ascii=False)
        except TypeError as exc:
            if on_error: on_error(exc)
