from src.utils.io.yaml import open_yaml, save_yaml

consts_path = 'src/consts.yaml'
config_path = 'data/config.yaml'
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


def load_config():
    """Read userdata config file, constants file and merge them."""
    consts = open_yaml(consts_path)
    user_cfg = open_yaml(config_path)
    raw_merged_cfg = {**consts, **user_cfg}
    merged_cfg = {key: optional_string_to_num(value) for key, value in raw_merged_cfg.items()}
    return DictToClass(**merged_cfg)


def save_config():
    """Save userdata config to file."""
    user_cfg = open_yaml(config_path)  # only to know which keys do we need to save
    user_cfg = {key: value for key, value in cfg.__dict__.items() if key in user_cfg}  # actual values from memory
    save_yaml(user_cfg, config_path, save_format='yaml')


def amend_config(cfg_patch):
    """Amend user config with given patch."""
    for key, value in cfg_patch.items():
        if value is not None:
            setattr(cfg, key, value)
    save_config()


# exported merged config
cfg = load_config()
