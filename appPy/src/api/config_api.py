from flask import Blueprint, request
from src.config import cfg, config_keys, amend_config
from .helpers.schema_validation import unpack_request_schema

config_blueprint = Blueprint('Config', __name__, url_prefix='/config')


@config_blueprint.get('')
def get_config_api():
    """Return user config."""
    return cfg.__dict__


@config_blueprint.put('')
def amend_table_api():
    """Amend user config."""
    schema = {key: False for key in config_keys}
    params = unpack_request_schema(request, schema)
    amend_config(params)
    return "OK"
