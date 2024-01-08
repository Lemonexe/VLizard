from flask import Flask
from werkzeug.exceptions import HTTPException
from src.utils.errors import AppException
from src.api.td_test import td_test_blueprint
from src.api.fit import fit_blueprint
from src.api.vapor import vapor_blueprint
from src.api.vle import vle_blueprint

app = Flask(__name__)


@app.get('/is_it_up')
def is_it_up():
    """Return OK to check if the server is up."""
    return {'status': 'ok'}


@app.errorhandler(HTTPException)
def handle_bad_request(err):
    """Handle all thrown HTTP exceptions."""
    return {'error': str(err)}, err.code


@app.errorhandler(AppException)
def handle_app_exception(err):
    """Handle the custom AppException thrown by the app core, informing that the calculation has failed."""
    return {'error': str(err)}, 422


@app.errorhandler(Exception)
def handle_exception_default(err):
    """Handle all other exceptions verbosely (by default it'd just say 500 internal error)."""
    return {'error': str(err)}, 500


# register modules and run the app
app.register_blueprint(td_test_blueprint)
app.register_blueprint(fit_blueprint)
app.register_blueprint(vapor_blueprint)
app.register_blueprint(vle_blueprint)
