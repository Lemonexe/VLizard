import numpy as np
from src.utils.io.echo import echo, ok_echo, err_echo, underline_echo
from src.config import cfg, cst
from .Area import Area


class Redlich_Kister_test(Area):

    def __init__(self, compound1, compound2, dataset_name):
        """
        Perform Redlich-Kister area test as object with results and methods for reporting & visualization.

        compound1, compound2 (str): names of compounds
        dataset_name (str): name of dataset
        """
        super().__init__(compound1, compound2, dataset_name)
        self.keys_to_serialize = ['D', 'is_consistent', 'curve_dif', 'curve_sum', 'x_1', 'curve']

        # the test criterion D [%]
        self.D = self.curve_dif / self.curve_sum * 100
        self.is_consistent = self.D <= cfg.rk_D_criterion

        self.x_tab = np.linspace(0, 1, cst.x_points_smooth_plot)
        self.curve_tab = self.curve_spline(self.x_tab)

    def get_title(self):
        return f'Redlich-Kister test for {super().get_title()}'

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()
        echo(f'D = {self.D:.1f}')
        if self.is_consistent:
            ok_echo(f'D < {cfg.rk_D_criterion:.0f}')
            ok_echo('OK, data consistency is proven')
        else:
            err_echo(f'D > {cfg.rk_D_criterion:.0f}')
            err_echo('NOT OK, data consistency is disproven')
        echo(f'\ta-b = {self.curve_dif:.4f}')
        echo(f'\ta+b = {self.curve_sum:.4f}')
        echo('')
