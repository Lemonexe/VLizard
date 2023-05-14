import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.errors import CLI_error_boundary
from src.utils.do_datasets import do_datasets
from src.TD.Redlich_Kister_test import Redlich_Kister_test


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
@click.option('--noplot', is_flag=True, help='Suppress rendering of plots')
def cli_rk(compound1, compound2, dataset, noplot):
    """Perform Redlich-Kister test for COMPOUND1 code, COMPOUND2 code."""

    def do_for_dataset(compound1, compound2, dataset):
        rk_test = Redlich_Kister_test(compound1, compound2, dataset)
        rk_test.report()

        if noplot: return
        rk_test.plot_rk()
        rk_test.render_plot_CLI()

    do_datasets(compound1, compound2, dataset, do_for_dataset)


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_rk)
