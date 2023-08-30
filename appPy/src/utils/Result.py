from .io.echo import echo, warn_echo
from .io.json import cast_to_jsonable


def cast_to_jsonable_recursive(value):
    """Recursively cast value for json serialization, or serialize Result instances."""
    if isinstance(value, list): return [cast_to_jsonable_recursive(child) for child in value]
    if isinstance(value, dict): return {key: cast_to_jsonable_recursive(child) for key, child in value.items()}
    if isinstance(value, Result): return value.serialize()
    return cast_to_jsonable(value)


class Result:
    """
    Utility class to provide standard interface for results of an operation (e.g. analysis or regression).
    """

    def __init__(self):
        self.status = 0  # 0 = ok, 1 = warning
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

    # recursively serialize itself to a dict that can be converted to json
    def serialize(self):
        keys = ['status', 'warnings'] + self.keys_to_serialize
        return {key: cast_to_jsonable_recursive(getattr(self, key)) for key in keys}
