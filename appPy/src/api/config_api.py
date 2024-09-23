from flask import Blueprint, request
from src.config import cfg, amend_config
from src.default_config import default_config_dict
from src.utils.io.local_files import open_user_folder
from .helpers.schema_validation import unpack_request_schema

config_blueprint = Blueprint('Config', __name__, url_prefix='/config')


@config_blueprint.get('')
def get_config_api():
    """Return user config."""
    return cfg.__dict__


@config_blueprint.put('')
def amend_config_api():
    """Amend user config."""
    config_keys = default_config_dict.keys()
    schema = {key: False for key in config_keys}
    params = unpack_request_schema(request, schema)
    amend_config(params)
    return "OK"


@config_blueprint.get('open_data_dir')
def get_open_dir_api():
    open_user_folder()
    return "OK"
