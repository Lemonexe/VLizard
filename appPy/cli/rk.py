import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.errors import CLI_error_boundary
from src.utils.datasets import do_datasets
from src.utils.io.plot import pause_to_keep_charts
from src.TD.Redlich_Kister_test import Redlich_Kister_test


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
@click.option('--plot', is_flag=True, help='Plot area')
def cli_rk(compound1, compound2, dataset, plot):
    """Perform Redlich-Kister test for two compound codes."""

    def do_for_dataset(compound1, compound2, dataset):
        rk_test = Redlich_Kister_test(compound1, compound2, dataset)
        rk_test.report()

        if plot: rk_test.plot()

    do_datasets(compound1, compound2, dataset, do_for_dataset)
    if plot: pause_to_keep_charts()


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_rk)
