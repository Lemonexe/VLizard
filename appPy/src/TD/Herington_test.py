import numpy as np
from src.utils.underline import underline
from src.config import herington_DJ_criterion
from .Area import Area


# perform Herington area test as object with results and methods for reporting
class Herington_test(Area):

    def __init__(self, compound1, compound2, dataset_name):
        super().__init__(compound1, compound2, dataset_name)

        self.warn('WARNING: Herington test is deprecated, results should be considered only advisory')

        T_min, T_max = np.min(self.T), np.max(self.T)

        self.D = self.curve_dif / self.curve_sum * 100
        self.J = 150 * (T_max-T_min) / T_min
        self.DJ = abs(self.D - self.J)
        self.is_consistent = self.DJ <= herington_DJ_criterion
        self.criterion = herington_DJ_criterion

    def get_title(self):
        return f'Herington test for {super().get_title()}'

    def report(self):
        print(underline(self.get_title()))
        self.report_warnings()
        print(f'|D-J| = {self.DJ:.1f}')
        if self.is_consistent:
            print(f'|D-J| < {self.criterion:.0f} → OK')
            print('(data consistency is proven)')
        else:
            print(f'|D-J| > {self.criterion:.0f} → NOT OK')
            print('(data consistency is disproven)')
        print(f'\tD = {self.D:.1f}')
        print(f'\tJ = {self.J:.1f}')
        print('')
