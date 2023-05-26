import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.errors import CLI_error_boundary
from src.utils.do_datasets import do_datasets, pause_to_keep_charts
from src.TD.Slope_test import Slope_test


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
@click.option('--plot', is_flag=True, help='Plot slope test residual & gamma derivations')
def cli_slope(compound1, compound2, dataset, plot):
    """Perform slope test for COMPOUND1 code, COMPOUND2 code."""

    def do_for_dataset(compound1, compound2, dataset):
        slope_test = Slope_test(compound1, compound2, dataset)
        slope_test.report()

        if plot: slope_test.plot()

    do_datasets(compound1, compound2, dataset, do_for_dataset)
    if plot: pause_to_keep_charts()


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_slope)
