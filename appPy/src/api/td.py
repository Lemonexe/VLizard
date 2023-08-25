from flask import Blueprint, request

td_blueprint = Blueprint('TD', __name__)


@td_blueprint.post('/api/gamma_test')
def gamma_test():
    data = request.get_json()
    processed_data = {'received_data': data, 'message': 'Data processed successfully'}
    return processed_data, 200
