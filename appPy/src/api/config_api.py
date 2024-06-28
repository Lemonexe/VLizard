import os
from flask import Blueprint, request
from src.config import cfg, config_keys, amend_config
from src.utils.io.local_files import data_folder_path
from .helpers.schema_validation import unpack_request_schema

config_blueprint = Blueprint('Config', __name__, url_prefix='/config')


@config_blueprint.get('')
def get_config_api():
    """Return user config."""
    return cfg.__dict__


@config_blueprint.put('')
def amend_config_api():
    """Amend user config."""
    schema = {key: False for key in config_keys}
    params = unpack_request_schema(request, schema)
    amend_config(params)
    return "OK"


@config_blueprint.get('open_data_dir')
def get_open_dir_api():
    """Opens directory with the local userdata."""
    os.startfile(data_folder_path)
    return "OK"
