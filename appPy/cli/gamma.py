import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.errors import CLI_error_boundary, AppException
from src.utils.datasets import do_datasets
from src.utils.io.plot import pause_to_keep_charts
from src.plot.Gamma_plot import Gamma_plot


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
@click.option('--gamma', is_flag=True, help='Plot activity coeffs including the model with error')
@click.option('--phi', is_flag=True, help='Plot model fugacity coefficients')
@click.option('--virial', is_flag=True, help='Use virial equation for fugacity coefficients, otherwise ideal gas')
@click.option('--c12', help='NRTL c_12 parameter override, otherwise use default model value')
def cli_gamma(compound1, compound2, dataset, gamma, phi, virial, c12):
    """Perform simple Gamma test for two compound codes."""

    if phi and not virial:
        raise AppException('Cannot plot fugacity coefficients without virial equation.')

    def do_for_dataset(comp1, comp2, ds):
        gamma_test = Gamma_plot(comp1, comp2, ds, virial, c12)
        gamma_test.report()

        if gamma: gamma_test.plot_gamma_model(mode='ion')
        if phi: gamma_test.plot_phi_model(mode='ion')

    do_datasets(compound1, compound2, dataset, do_for_dataset)
    if gamma or phi: pause_to_keep_charts()


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_gamma)
