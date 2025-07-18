import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.systems import validate_system_or_swap
from src.utils.errors import CLI_error_boundary
from src.utils.io.plot import pause_to_keep_charts
from src.fit.persist_fit import get_persisted_fit_with_model
from src.plot.VLE_Tabulation_plot import VLE_Tabulation_plot


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.argument('model_name')
@click.option('-p', help='Pressure [kPa]')
@click.option('-t', help='Temperature [K]')
@click.option('--xy', is_flag=True, help='Plot x,y diagram')
@click.option('--txy', is_flag=True, help='Plot T,x,y diagram')
@click.option('--pxy', is_flag=True, help='Plot p,x,y diagram')
@click.option('--gamma', is_flag=True, help='Plot activity coeff')
def cli_tabulate(compound1, compound2, model_name, p, t, xy, txy, pxy, gamma):
    """Tabulate existing fit of VLE data, specified by model name."""

    compound1, compound2 = validate_system_or_swap(compound1, compound2)
    p = None if p is None else float(p)
    t = None if t is None else float(t)

    pfit, model = get_persisted_fit_with_model(compound1, compound2, model_name)

    nparams = pfit['results']['nparams']
    params = [nparams[key] for key in model.param_names]
    tab = VLE_Tabulation_plot(model, params, compound1, compound2, p, t, None)

    if xy: tab.plot_xy(mode='ion')
    if txy: tab.plot_Txy(mode='ion')
    if pxy: tab.plot_pxy(mode='ion')
    if gamma: tab.plot_gamma(mode='ion')

    if xy or txy or pxy or gamma: pause_to_keep_charts()


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_tabulate)
