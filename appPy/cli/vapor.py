import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.errors import CLI_error_boundary
from src.utils.io.plot import pause_to_keep_charts
from src.TD.Vapor import Vapor


@click.command()
@click.argument('compound')
@click.option('--plot', is_flag=True, help='Plot vapor pressure')
def cli_vapor(compound, plot):
    """Analyze vapor pressure for COMPOUND code."""
    vapor = Vapor(compound)
    vapor.report()

    if plot:
        vapor.plot()
        pause_to_keep_charts()


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_vapor)
