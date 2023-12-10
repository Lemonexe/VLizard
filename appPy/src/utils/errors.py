import click
from src.config import cfg


class AppException(Exception):
    """
    Exception when user input is valid, but calculation cannot proceed, e.g. when resource cannot be found etc.
    Not to be used to catch programmer errors (then use built-in python exceptions).
    Handled globally in CLI_error_boundary or Flask errorhandler (as 422).
    """


def CLI_error_boundary(callback):
    """Wrapper for CLI functions to catch AppException."""
    try:
        callback()
    except AppException as err:
        raise SystemExit(click.style(f'ERROR: {err}', fg=cfg.cli_fg_err)) from err
