from werkzeug.exceptions import BadRequest


def unpack_request_schema(request, schema):
    """
    Unpacks params from Flask request using simple validation schema.

    request (Flask request): expected to bear json payload with paramKeys
    schema (dict of {str: bool}): for each paramKey bears if True param is mandatory, if False it's optional
    return (dict of {str: unknown}): for each paramKey bears extracted param value, or None if optional param not in payload
    """
    for key in request.json.keys():
        if key not in schema: raise BadRequest(f'Unexpected parameter {key}')

    def get_or_throw(queried_key, is_mandatory):
        param = request.json.get(queried_key)
        if is_mandatory and param is None: raise BadRequest(f'Missing mandatory parameter {queried_key}')
        return param

    return {key: get_or_throw(key, is_mandatory) for key, is_mandatory in schema.items()}
