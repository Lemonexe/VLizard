import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.errors import CLI_error_boundary
from src.utils.datasets import do_datasets
from src.utils.io.plot import pause_to_keep_charts
from src.TD.Fredenslund_test import Fredenslund_test


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
@click.option('--legendre', help='Order of Legendre polynomials', default=4, show_default=True, type=int)
@click.option('--ge', is_flag=True, help='Plot gE')
@click.option('--res', is_flag=True, help='Plot p,y1,y2 residuals')
def cli_fredenslund(compound1, compound2, dataset, legendre, ge, res):
    """Perform Fredenslund test for COMPOUND1 code, COMPOUND2 code."""

    def do_for_dataset(compound1, compound2, dataset):
        fredenslund_test = Fredenslund_test(compound1, compound2, dataset, legendre)
        fredenslund_test.report()

        if ge: fredenslund_test.plot_g_E()
        if res:
            fredenslund_test.plot_p_res()
            fredenslund_test.plot_y_1_res()

    do_datasets(compound1, compound2, dataset, do_for_dataset)
    if ge or res: pause_to_keep_charts()


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_fredenslund)
