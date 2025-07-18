import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.errors import CLI_error_boundary
from src.utils.datasets import do_datasets
from src.utils.io.plot import pause_to_keep_charts
from src.plot.VLE_plot import VLE_plot


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
@click.option('--xy', is_flag=True, help='Plot x,y diagram')
@click.option('--txy', is_flag=True, help='Plot T,x,y diagram')
@click.option('--pxy', is_flag=True, help='Plot p,x,y diagram')
@click.option('--gamma', is_flag=True, help='Plot activity coeff')
def cli_vle(compound1, compound2, dataset, xy, txy, pxy, gamma):
    """Analyze VLE data for two compound codes."""

    def do_for_dataset(comp1, comp2, ds):
        vle = VLE_plot(comp1, comp2, ds)
        vle.report()

        if xy: vle.plot_xy(mode='ion')
        if txy: vle.plot_Txy(mode='ion')
        if pxy: vle.plot_pxy(mode='ion')
        if gamma: vle.plot_gamma(mode='ion')

    do_datasets(compound1, compound2, dataset, do_for_dataset)
    if xy or txy or pxy or gamma: pause_to_keep_charts()


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_vle)
