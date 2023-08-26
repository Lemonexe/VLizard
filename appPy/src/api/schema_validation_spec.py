import pytest
from werkzeug.exceptions import BadRequest
from .schema_validation import unpack_request_schema


# mock of Flask request
class Request():

    def __init__(self, payload):
        self.json = payload


full_request = Request({'param2': 'value2', 'param1': 'value1'})  # request may be unordered..
partial_request = Request({'param1': 'value1'})
bad_request = Request({'something_else': 1234})
excess_request = Request({'param1': 'value1', 'param2': 'value2', 'param3': 'value3'})

mandatory_schema = {'param1': True, 'param2': True}  # schema with all params mandatory
optional_schema = {'param1': True, 'param2': False}  # schema with an optional param


def test_unpack_request_schema():
    # strict schema that requires value2
    params = unpack_request_schema(full_request, mandatory_schema)
    assert params == {'param1': 'value1', 'param2': 'value2'}
    assert list(params.keys()) == ['param1', 'param2']  # order matters

    with pytest.raises(BadRequest):
        unpack_request_schema(partial_request, mandatory_schema)
    with pytest.raises(BadRequest):
        unpack_request_schema(bad_request, mandatory_schema)
    with pytest.raises(BadRequest):
        unpack_request_schema(excess_request, mandatory_schema)

    # loose schema that allows for optional value2
    params = unpack_request_schema(full_request, optional_schema)
    assert params == {'param1': 'value1', 'param2': 'value2'}
    assert list(params.keys()) == ['param1', 'param2']

    params = unpack_request_schema(partial_request, optional_schema)
    assert params == {'param1': 'value1', 'param2': None}
    assert list(params.keys()) == ['param1', 'param2']

    with pytest.raises(BadRequest):
        unpack_request_schema(bad_request, optional_schema)
    with pytest.raises(BadRequest):
        unpack_request_schema(excess_request, optional_schema)
