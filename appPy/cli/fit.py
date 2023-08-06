import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.errors import CLI_error_boundary
from src.utils.do_datasets import pause_to_keep_charts
from src.regress.Fit import Fit, default_model, supported_models


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-m', '--model', default=default_model, help=f'Model to fit, choose {" or ".join(supported_models)}')
@click.option('-d', '--datasets', help='Comma-separated exact dataset names, otherwise do all datasets of the system')
@click.option('-p', '--params', help='TODO')
@click.option('--xy', is_flag=True, help='Plot x,y diagram + regression')
@click.option('--txy', is_flag=True, help='Plot T,x,y diagram + regression')
@click.option('--gamma', is_flag=True, help='Plot activity coeff + regression')
def cli_fit(compound1, compound2, model, datasets, params, xy, txy, gamma):
    """Fit binary VLE data with a given model, and optionally with specified initial parameters."""

    fit = Fit(compound1, compound2, model, datasets, params)
    fit.report()

    if xy: fit.plot_xy()
    if txy: fit.plot_Txy()
    if gamma: fit.plot_gamma()
    if xy or txy or gamma: pause_to_keep_charts()


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_fit)
