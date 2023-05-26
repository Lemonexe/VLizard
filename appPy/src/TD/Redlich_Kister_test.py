import click
import numpy as np
from matplotlib import pyplot as plt
from src.utils.underline import underline
from src.config import cli_fg_ok, cli_fg_err, x_points_smooth_plot, rk_D_criterion
from .Area import Area


# perform Redlich-Kister area test as object with results and methods for reporting & visualization
class Redlich_Kister_test(Area):

    def __init__(self, compound1, compound2, dataset_name):
        super().__init__(compound1, compound2, dataset_name)

        # the test criterion D [%]
        self.D = self.curve_dif / self.curve_sum * 100
        self.is_consistent = self.D <= rk_D_criterion
        self.criterion = rk_D_criterion

    def get_title(self):
        return f'Redlich-Kister test for {super().get_title()}'

    def report(self):
        click.echo(underline(self.get_title()))
        self.report_warnings()
        click.echo(f'D = {self.D:.1f}')
        if self.is_consistent:
            click.secho(f'D < {self.criterion:.0f}', fg=cli_fg_ok)
            click.secho('OK, data consistency is proven', fg=cli_fg_ok)
        else:
            click.secho(f'D > {self.criterion:.0f}', fg=cli_fg_err)
            click.secho('NOT OK, data consistency is disproven', fg=cli_fg_err)
        click.echo(f'\ta-b = {self.curve_dif:.4f}')
        click.echo(f'\ta+b = {self.curve_sum:.4f}')
        click.echo('')

    def plot(self):
        # smooth tabelation of curve
        x_tab = np.linspace(0, 1, x_points_smooth_plot)
        curve_tab = self.curve_spline(x_tab)

        plt.figure()
        plt.plot(self.x_1, self.curve, 'Dk')
        plt.plot(x_tab, curve_tab, '-k')
        plt.axhline(y=0, color='k', linestyle=':')
        plt.title(self.get_title())
        plt.xlim(0, 1)
        plt.xlabel('$x_1$')
        plt.ylabel('ln $\\gamma_1/\\gamma_2$')
        plt.ion()
        plt.show()
