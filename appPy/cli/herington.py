import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.errors import CLI_error_boundary
from src.utils.datasets import do_datasets
from src.TD.Herington_test import Herington_test


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
def cli_herington(compound1, compound2, dataset):
    """Perform Herington test for COMPOUND1 code, COMPOUND2 code."""

    def do_for_dataset(compound1, compound2, dataset):
        herington_test = Herington_test(compound1, compound2, dataset)
        herington_test.report()

    do_datasets(compound1, compound2, dataset, do_for_dataset)


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_herington)
