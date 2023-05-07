import sys

sys.path.append(sys.path[0] + '/..')

import click
from matplotlib import pyplot as plt
from src.plots.plot_antoine import plot_antoine


@click.command()
@click.argument('compound')
def antoine(compound):
    """Plot Antoine for COMPOUND code."""
    try:
        plot_antoine(compound)
        plt.show()
    except ValueError as err:
        raise SystemExit(err) from err


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    antoine()
