from werkzeug.exceptions import BadRequest


# unpack keys from dict, or throw BadRequest
def unpack_request_or_throw(request, keys):
    data = request.get_json()
    try:
        return [data[key] for key in keys]
    except KeyError as exc:
        raise BadRequest(f'Missing {exc}') from exc
