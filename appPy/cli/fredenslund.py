import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.errors import CLI_error_boundary
from src.utils.do_datasets import do_datasets
from src.TD.Fredenslund_test import Fredenslund_test


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
@click.option('--noplot', is_flag=True, help='Suppress rendering of plots')
def cli_fredenslund(compound1, compound2, dataset, noplot):
    """Perform Fredenslund test for COMPOUND1 code, COMPOUND2 code."""

    def do_for_dataset(compound1, compound2, dataset):
        fredenslund_test = Fredenslund_test(compound1, compound2, dataset)
        fredenslund_test.report()

        if noplot: return
        fredenslund_test.plot_g_E()
        fredenslund_test.render_plot_CLI()
        fredenslund_test.plot_p_res()
        fredenslund_test.render_plot_CLI()
        fredenslund_test.plot_y_1_res()
        fredenslund_test.render_plot_CLI()
        fredenslund_test.plot_y_2_res()
        fredenslund_test.render_plot_CLI()

    do_datasets(compound1, compound2, dataset, do_for_dataset)


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_fredenslund)
