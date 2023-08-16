import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.errors import CLI_error_boundary
from src.utils.datasets import do_datasets
from src.utils.io.plot import pause_to_keep_charts
from src.TD.Gamma_test import Gamma_test


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
@click.option('--plot', is_flag=True, help='Plot activity coeff including van Laar model with error')
def cli_gamma(compound1, compound2, dataset, plot):
    """Perform simple Gamma test for COMPOUND1 code, COMPOUND2 code."""

    def do_for_dataset(compound1, compound2, dataset):
        gamma_test = Gamma_test(compound1, compound2, dataset)
        gamma_test.report()

        if plot: gamma_test.plot_gamma_model()

    do_datasets(compound1, compound2, dataset, do_for_dataset)
    if plot: pause_to_keep_charts()


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_gamma)
