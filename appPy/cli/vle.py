import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.errors import CLI_error_boundary
from src.utils.datasets import do_datasets
from src.utils.io.plot import pause_to_keep_charts
from src.TD.VLE import VLE


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
@click.option('--xy', is_flag=True, help='Plot x,y diagram')
@click.option('--txy', is_flag=True, help='Plot T,x,y diagram')
@click.option('--gamma', is_flag=True, help='Plot activity coeff')
def cli_vle(compound1, compound2, dataset, xy, txy, gamma):
    """Analyze VLE data for two compound codes."""

    def do_for_dataset(compound1, compound2, dataset):
        vle = VLE(compound1, compound2, dataset)
        vle.report()

        if xy: vle.plot_xy()
        if txy: vle.plot_Txy()
        if gamma: vle.plot_gamma()

    do_datasets(compound1, compound2, dataset, do_for_dataset)
    if xy or txy or gamma: pause_to_keep_charts()


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_vle)
