import numpy as np
from .io.echo import echo, warn_echo


# cast value so it's acceptable for json serialization
def cast_type_to_jsonable(value):
    if isinstance(value, np.ndarray): return value.tolist()
    if isinstance(value, np.bool_): return bool(value)
    return value


# utility class to provide standard interface for results of an operation
# status is 0 for success, 1 for warning (error is not handled)
class Result:

    def __init__(self):
        self.status = 0
        self.warnings = []
        self.keys_to_serialize = []  # custom keys for serialization, may be filled by inheriting classes

    # just warn & forget :)
    def warn(self, what):
        self.status = 1 if self.status < 1 else self.status
        if isinstance(what, list):
            self.warnings.extend(what)
        elif isinstance(what, str):
            self.warnings.append(what)
        else:
            raise TypeError('Error while warning, it must be instance of list || str')

    # take another Result instance and merge it here
    def merge_status(self, *other_results):
        for other_result in other_results:
            if not isinstance(other_result, Result): raise TypeError('other_result must be a Result instance')

            self.status = max(self.status, other_result.status)
            self.warnings.extend(other_result.warnings)

    # report on warnings in CLI mode
    def report_warnings(self):
        if self.status > 0:
            messages = [f'WARNING: {warning}' for warning in self.warnings]
            warn_echo('\n'.join(messages))
            if len(messages): echo('')

    # serialize to a dict that can be converted to json
    def serialize(self):
        keys = ['status', 'warnings'] + self.keys_to_serialize
        return {key: cast_type_to_jsonable(getattr(self, key)) for key in keys}
