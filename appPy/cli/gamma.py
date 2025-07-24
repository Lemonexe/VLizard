import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.errors import CLI_error_boundary
from src.utils.datasets import do_datasets
from src.utils.io.plot import pause_to_keep_charts
from src.plot.Gamma_plot import Gamma_plot


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
@click.option('--gamma', is_flag=True, help='Plot activity coeffs including the model with error')
@click.option('--phi', is_flag=True, help='Plot model fugacity coefficients')
def cli_gamma(compound1, compound2, dataset, gamma, phi):
    """Perform simple Gamma test for two compound codes."""

    def do_for_dataset(comp1, comp2, ds):
        gamma_test = Gamma_plot(comp1, comp2, ds)
        gamma_test.report()

        if gamma: gamma_test.plot_gamma_model(mode='ion')
        if phi: gamma_test.plot_phi_model(mode='ion')

    do_datasets(compound1, compound2, dataset, do_for_dataset)
    if gamma or phi: pause_to_keep_charts()


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_gamma)
