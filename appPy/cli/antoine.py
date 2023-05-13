import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.TD.Antoine import Antoine
from src.utils.errors import CLI_error_boundary


@click.command()
@click.argument('compound')
def cli_antoine(compound):
    """Plot Antoine for COMPOUND code."""
    antoine = Antoine(compound)
    antoine.report_warnings()
    antoine.plot()
    antoine.render_plot_CLI()


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_antoine)
