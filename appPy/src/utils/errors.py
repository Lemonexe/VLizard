import click
from src.config import cli_fg_err


# user input is valid, but calculation cannot proceed, e.g. when resource cannot be found etc.
# not to be used to catch programmer errors (then use built-in python exceptions)
# handled globally in CLI_error_boundary or Flask errorhandler (as 422)
class AppException(Exception):
    pass


# wrapper for CLI functions to catch AppException
def CLI_error_boundary(callback):
    try:
        callback()
    except AppException as err:
        raise SystemExit(click.style(f'ERROR: {err}', fg=cli_fg_err)) from err
