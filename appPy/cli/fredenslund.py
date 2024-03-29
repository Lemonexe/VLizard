import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.config import cfg
from src.utils.errors import CLI_error_boundary
from src.utils.datasets import do_datasets
from src.utils.io.plot import pause_to_keep_charts
from src.plot.Fredenslund_plot import Fredenslund_plot


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
@click.option('--legendre', help=f'Order of Legendre polynomials (default {cfg.default_legendre_order})', type=int)
@click.option('--ge', is_flag=True, help='Plot gE')
@click.option('--res', is_flag=True, help='Plot p,y1,y2 residuals')
def cli_fredenslund(compound1, compound2, dataset, legendre, ge, res):
    """Perform Fredenslund test for two compound codes."""

    def do_for_dataset(comp1, comp2, ds):
        fredenslund_test = Fredenslund_plot(comp1, comp2, ds, legendre)
        fredenslund_test.report()

        if ge: fredenslund_test.plot_g_E(mode='ion')
        if res:
            fredenslund_test.plot_p_res(mode='ion')
            fredenslund_test.plot_y_1_res(mode='ion')

    do_datasets(compound1, compound2, dataset, do_for_dataset)
    if ge or res: pause_to_keep_charts()


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_fredenslund)
