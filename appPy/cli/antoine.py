import sys

sys.path.append(sys.path[0] + '/..')

import click
from matplotlib import pyplot as plt
from src.TD.Antoine import Antoine


@click.command()
@click.argument('compound')
def cli_antoine(compound):
    """Plot Antoine for COMPOUND code."""
    antoine = Antoine(compound)
    antoine.check_status_CLI()
    antoine.plot()
    plt.show()


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    cli_antoine()
