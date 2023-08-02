import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.errors import CLI_error_boundary
from src.utils.do_datasets import do_datasets, pause_to_keep_charts
from src.TD.VLE import VLE


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
@click.option('--xy', is_flag=True, help='Plot x,y diagram')
@click.option('--txy', is_flag=True, help='Plot T,x,y diagram')
@click.option('--gamma', is_flag=True, help='Plot activity coeff')
@click.option('--gamma-model',
              is_flag=True,
              help='Plot activity coeff including van Laar model with error (used for activity coeff validation)')
def cli_vle(compound1, compound2, dataset, xy, txy, gamma, gamma_model):
    """Get VLE data & calculate activity coeffs for COMPOUND1 code, COMPOUND2 code."""

    def do_for_dataset(compound1, compound2, dataset):
        vle = VLE(compound1, compound2, dataset)
        vle.report()

        if xy: vle.plot_xy()
        if txy: vle.plot_Txy()
        if gamma or gamma_model: vle.plot_gamma(gamma_model)

    do_datasets(compound1, compound2, dataset, do_for_dataset)
    if xy or txy or gamma or gamma_model: pause_to_keep_charts()


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_vle)
