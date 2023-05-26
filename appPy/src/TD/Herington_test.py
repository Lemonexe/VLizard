import click
import numpy as np
from src.utils.underline import underline
from src.config import cli_fg_ok, cli_fg_err, herington_DJ_criterion
from .Area import Area


# perform Herington area test as object with results and methods for reporting
class Herington_test(Area):

    def __init__(self, compound1, compound2, dataset_name):
        super().__init__(compound1, compound2, dataset_name)

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
        click.echo(underline(self.get_title()))
        self.report_warnings()
        click.echo(f'|D-J| = {self.DJ:.1f}')
        if self.is_consistent:
            click.secho(f'|D-J| < {self.criterion:.0f}', fg=cli_fg_ok)
            click.secho('OK, data consistency is proven', fg=cli_fg_ok)
        else:
            click.secho(f'|D-J| > {self.criterion:.0f}', fg=cli_fg_err)
            click.secho('NOT OK, data consistency is disproven', fg=cli_fg_err)
        click.echo(f'\tD = {self.D:.1f}')
        click.echo(f'\tJ = {self.J:.1f}')
        click.echo('')
