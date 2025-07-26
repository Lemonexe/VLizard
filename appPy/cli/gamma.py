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
@click.option('-c', '--consts', help='Comma-separated names of parameters to be kept constant')
@click.option('--gamma', is_flag=True, help='Plot activity coeffs including the model with error')
@click.option('--phi', is_flag=True, help='Plot model fugacity coefficients')
@click.option('--c12', help='NRTL c_12 parameter override, otherwise use default model value')
def cli_gamma(compound1, compound2, dataset, consts, gamma, phi, c12):
    """Perform simple Gamma test for two compound codes."""

    def do_for_dataset(comp1, comp2, ds):
        gamma_test = Gamma_plot(comp1, comp2, ds, parse_consts(consts), c12)
        gamma_test.report()

        if gamma: gamma_test.plot_gamma_model(mode='ion')
        if phi: gamma_test.plot_phi_model(mode='ion')

    do_datasets(compound1, compound2, dataset, do_for_dataset)
    if gamma or phi: pause_to_keep_charts()


def parse_consts(consts):
    """Parse comma-separated param names as unique list of stripped strings."""
    if not consts: return ['c_12']
    return list({param_name.strip() for param_name in consts.split(',')})  # deduplicated by set comprehension


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_gamma)
