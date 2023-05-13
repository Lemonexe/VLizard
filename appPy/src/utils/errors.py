# exception Class that shall be used when user input is legitimate, but calculation is unable to proceed
# for example when resource cannot be found etc.
# not to be used to catch programmer errors, then use built-in exceptions
class AppException(Exception):
    pass


# wrapper for CLI functions to catch AppException
def CLI_error_boundary(callback):
    try:
        callback()
    except AppException as err:
        raise SystemExit(err) from err
