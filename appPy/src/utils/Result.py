from matplotlib import pyplot as plt


# utility class to provide standard interface for results of an operation
# status is 0 for success, 1 for warning, AppException for error state
# these shall be used for warnings concerning the calculations
# while for application errors, raise shall be used
class Result:

    def __init__(self):
        self.status = 0
        self.warnings = []

    # just warn & forget :)
    def warn(self, what):
        self.status = 1 if self.status < 1 else self.status
        if isinstance(what, list):
            self.warnings.extend(what)
        elif isinstance(what, str):
            self.warnings.append(what)
        else:
            raise TypeError('Error while warning, it must be instance of list || str')

    # take an other Result instance and merge it here
    def merge_status(self, *other_results):
        for other_result in other_results:
            if not isinstance(other_result, Result): raise TypeError('other_result must be a Result instance')

            self.status = max(self.status, other_result.status)
            self.warnings.extend(other_result.warnings)

    # report on warnings in CLI mode
    def report_warnings(self):
        print(self.warnings, sep='\n')

    # finish rendering plot in CLI mode
    def render_plot_CLI(self):
        plt.show()
