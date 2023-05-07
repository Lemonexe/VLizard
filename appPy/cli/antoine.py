import sys
sys.path.append(sys.path[0] + '/..')
import click
from matplotlib import pyplot as plt
from src.plots.plot_antoine import plot_antoine


@click.command()
@click.argument('compound')
def antoine(compound):
    """Plot Antoine for COMPOUND code."""
    plot_antoine(compound)
    plt.show()

if __name__ == '__main__':
    antoine()
