import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.systems import validate_system_or_swap
from src.utils.errors import CLI_error_boundary, AppException
from src.utils.io.plot import pause_to_keep_charts
from src.plot.Fit_VLE_plot import Fit_VLE_plot
from src.fit.Fit_VLE import default_model, supported_model_names

model_list = ", ".join(supported_model_names)


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-m', '--model', default=default_model, help=f'Which model to fit, enter one of: {model_list}')
@click.option('-d', '--datasets', help='Comma-separated exact dataset names, otherwise do all datasets of the system')
@click.option('-p', '--params', help='Comma-separated initial parameters, will ignore params saved in file')
@click.option('-c', '--consts', help='Comma-separated names of parameters to be kept constant')
@click.option('--xy', is_flag=True, help='Plot x,y diagram + regression')
@click.option('--txy', is_flag=True, help='Plot T,x,y diagram + regression')
@click.option('--gamma', is_flag=True, help='Plot activity coeff + regression')
@click.option('--skip', is_flag=True, help='Skip optimization (use initial params for tabulation)')
def cli_fit(compound1, compound2, model, datasets, params, consts, xy, txy, gamma, skip):
    """Fit binary VLE data with a given model, datasets, and optionally with specified initial parameters."""

    compound1, compound2 = validate_system_or_swap(compound1, compound2)
    fit = Fit_VLE_plot(compound1, compound2, model, datasets, parse_params(params), parse_consts(consts))
    if not skip: fit.optimize()
    fit.report()

    if not (xy or txy or gamma): return
    fit.tabulate()
    if xy: fit.plot_xy_model(mode='ion')
    if txy: fit.plot_Txy_model(mode='ion')
    if gamma: fit.plot_gamma_model(mode='ion')
    pause_to_keep_charts()


def parse_params(params):
    """Parse comma-separated params as list of floats."""
    if not params: return None
    try:
        return [float(param.strip()) for param in params.split(',')]
    except ValueError as exc:
        raise AppException(f'Argument params must be a comma-separated list of floats, got {params}') from exc


def parse_consts(consts):
    """Parse comma-separated param names as unique list of stripped strings."""
    if not consts: return None
    return list({param_name.strip() for param_name in consts.split(',')})  # deduplicated by set comprehension


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_fit)
