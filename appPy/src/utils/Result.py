# utility class to provide standard interface for results of an operation
# these shall be used for errors & warnings concerning the calculations
# while for application errors, raise shall be used
class Result:

    def __init__(self):
        self.status = 0
        self.warnings = []
        self.error = None

    # just warn & forget :)
    def warn(self, what):
        self.status = 1 if self.status < 1 else self.status
        if isinstance(what, list):
            self.warnings.extend(what)
        elif isinstance(what, str):
            self.warnings.append(what)
        else:
            raise ValueError('Error while warning, it must be instance of list || str')

    # use this with return
    def err(self, message):
        self.status = 2
        if not isinstance(message, str):
            raise ValueError('Error while throwing error, it must be instance of str')
        self.error = message

    # take an other Result instance and merge it here
    def merge_status(self, other_result):
        if not isinstance(other_result, Result):
            raise TypeError('other_result must be a Result instance')

        self.status = max(self.status, other_result.status)
        self.warnings.extend(other_result.warnings)
        self.error = other_result.error

    # report on error || warnings in CLI mode
    def check_status_CLI(self):
        if self.status == 2:
            raise SystemExit(self.error)
        if self.status == 1:
            for message in self.warnings:
                print(message)
