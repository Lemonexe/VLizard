import numpy as np
from src.utils.io.echo import echo, ok_echo, err_echo, underline_echo
from src.config import herington_DJ_criterion
from .Area import Area


# perform Herington area test as object with results and methods for reporting
class Herington_test(Area):

    def __init__(self, compound1, compound2, dataset_name):
        super().__init__(compound1, compound2, dataset_name)
        self.keys_to_serialize = ['D', 'J', 'DJ', 'is_consistent', 'criterion']

        self.warn('Herington test is deprecated, results should be considered only advisory')

        T_min, T_max = np.min(self.T), np.max(self.T)

        self.D = self.curve_dif / self.curve_sum * 100
        self.J = 150 * (T_max-T_min) / T_min
        self.DJ = abs(self.D - self.J)
        self.is_consistent = self.DJ <= herington_DJ_criterion
        self.criterion = herington_DJ_criterion

    def get_title(self):
        return f'Herington test for {super().get_title()}'

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()
        echo(f'|D-J| = {self.DJ:.1f}')
        if self.is_consistent:
            ok_echo(f'|D-J| < {self.criterion:.0f}')
            ok_echo('OK, data consistency is proven')
        else:
            err_echo(f'|D-J| > {self.criterion:.0f}')
            err_echo('NOT OK, data consistency is disproven')
        echo(f'\tD = {self.D:.1f}')
        echo(f'\tJ = {self.J:.1f}')
        echo('')
