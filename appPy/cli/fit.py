import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.systems import validate_system_or_swap
from src.utils.errors import CLI_error_boundary, AppException
from src.utils.io.plot import pause_to_keep_charts
from src.fit.Fit import Fit, default_model, supported_models

model_list = ", ".join(supported_models.keys())


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-m', '--model', default=default_model, help=f'Which model to fit, enter one of: {model_list}')
@click.option('-d', '--datasets', help='Comma-separated exact dataset names, otherwise do all datasets of the system')
@click.option('-p', '--params', help='Comma-separated initial parameters, will ignore params saved in file')
@click.option('-c', '--consts', help='Comma-separated indices of parameters to be kept constant')
@click.option('--xy', is_flag=True, help='Plot x,y diagram + regression')
@click.option('--txy', is_flag=True, help='Plot T,x,y diagram + regression')
@click.option('--gamma', is_flag=True, help='Plot activity coeff + regression')
def cli_fit(compound1, compound2, model, datasets, params, consts, xy, txy, gamma):
    """Fit binary VLE data with a given model, and optionally with specified initial parameters."""

    compound1, compound2 = validate_system_or_swap(compound1, compound2)
    fit = Fit(compound1, compound2, model, datasets, parse_params(params), parse_consts(consts))
    fit.report()
    fit.tabulate()

    if xy: fit.plot_xy_model()
    if txy: fit.plot_Txy_model()
    if gamma: fit.plot_gamma_model()
    if xy or txy or gamma: pause_to_keep_charts()


def parse_params(params):
    if not params: return None
    try:
        return list(map(float, map(lambda str: str.strip(), params.split(','))))
    except ValueError as exc:
        raise AppException(f'Argument params must be a comma-separated list of floats, got {params}') from exc


def parse_consts(consts):
    if not consts: return None
    try:
        return list(map(int, map(lambda str: str.strip(), consts.split(','))))
    except ValueError as exc:
        raise AppException(f'Argument consts must be a comma-separated list of integers, got {consts}') from exc


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_fit)
