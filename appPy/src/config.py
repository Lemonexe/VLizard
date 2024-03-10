import os
from src.utils.io.yaml import open_yaml, save_yaml

consts_path = os.path.join('src', 'consts.yaml')
config_path = os.path.join('data', 'config.yaml')
default_config_path = os.path.join('src', 'config.yaml')

# expected keys of user config
config_keys = [
    'gamma_abs_tol', 'T_bounds_rel_tol', 'rk_D_criterion', 'herington_DJ_criterion', 'rk_quad_rel_tol',
    'fredenslund_criterion', 'default_legendre_order'
]


class DictToClass:
    """Convert dict to class with attributes."""

    def __init__(self, **entries):
        self.__dict__.update(entries)


def optional_string_to_num(value):
    """Convert string to int or float if possible, else return string."""
    try:
        result = float(value)
        return int(result) if result.is_integer() else result
    except ValueError:
        return value


def load_config_file(yaml_path):
    """Read a config file and parse it."""
    content = open_yaml(yaml_path)
    content = {key: optional_string_to_num(value) for key, value in content.items()}
    return DictToClass(**content)


def save_config(cfg2save):
    """Save userdata config to file."""
    save_yaml(cfg2save.__dict__, config_path, save_format='yaml')


def load_config_or_default():
    """Load user config if exists, else load default config and initialize user config from it."""
    if os.path.exists(config_path):
        return load_config_file(config_path)
    default_cfg = load_config_file(default_config_path)
    save_config(default_cfg)
    return default_cfg


def amend_config(cfg_patch):
    """Amend user config with given patch."""
    for key, value in cfg_patch.items():
        if value is not None:
            setattr(cfg, key, value)
    save_config(cfg)


# exported merged config
cfg = load_config_or_default()
cst = load_config_file(consts_path)
