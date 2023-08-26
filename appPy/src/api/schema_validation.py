from werkzeug.exceptions import BadRequest


# unpack params from request, using simple validation schema of params as dict {paramKey: bool}
# if True then param is mandatory, else it's optional (defaulting to None)
def unpack_request_schema(request, schema):
    for key in request.json.keys():
        if key not in schema: raise BadRequest(f'Unexpected parameter {key}')

    def get_or_throw(key, is_mandatory):
        param = request.json.get(key)
        if is_mandatory and param is None: raise BadRequest(f'Missing mandatory parameter {key}')
        return param

    return [get_or_throw(key, is_mandatory) for key, is_mandatory in schema.items()]
