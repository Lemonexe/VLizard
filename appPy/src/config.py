import os
from src.utils.io.yaml import open_yaml, save_yaml
from src.utils.io.local_files import config_path
from .default_config import consts_dict, default_config_dict

# expected keys of user config
config_keys = [
    'gamma_abs_tol', 'T_bounds_rel_tol', 'rk_D_criterion', 'herington_DJ_criterion', 'rk_quad_rel_tol',
    'fredenslund_criterion', 'default_legendre_order', 'chart_title', 'chart_legend', 'chart_aspect_ratio',
    'UI_expandAll', 'UoM_p', 'UoM_T'
]


class DictToClass:
    """Convert dict to class with attributes."""

    def __init__(self, **entries):
        self.__dict__.update(entries)


def optional_string_to_num(value):
    """Process a str, num or bool value by fixing a possibly stringified number."""
    if isinstance(value, bool): return value
    try:
        result = float(value)
        return int(result) if result.is_integer() else result
    except ValueError:
        return value


def load_config_file(yaml_path):
    """Read a config file and parse it."""
    content = open_yaml(yaml_path)
    if content is None: return None
    sanitized_content = {key: optional_string_to_num(value) for key, value in content.items()}
    return DictToClass(**sanitized_content)


def save_config(cfg2save):
    """Save a whole userdata config to file."""
    save_yaml(cfg2save.__dict__, config_path, save_format='yaml')


def load_config_or_default():
    """Load user config and update it if exists, else load default config and initialize user config from it."""
    if os.path.exists(config_path):
        curr_cfg = load_config_file(config_path)
        update_config_with_default(curr_cfg)
        return curr_cfg
    save_config(default_cfg)
    return default_cfg


def amend_config(cfg_patch):
    """Amend user config with given patch, both in-memory & in file."""
    for key, value in cfg_patch.items():
        if value is not None:
            setattr(cfg, key, value)
    save_config(cfg)


def update_config_with_default(curr_cfg):
    """Update user config with default config."""
    for key, value in default_cfg.__dict__.items():
        if key not in curr_cfg.__dict__:
            setattr(curr_cfg, key, value)
    save_config(curr_cfg)


# exported merged config
default_cfg = DictToClass(**default_config_dict)
cfg = load_config_or_default()
cst = DictToClass(**consts_dict)
