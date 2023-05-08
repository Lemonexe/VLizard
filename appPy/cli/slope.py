import sys

sys.path.append(sys.path[0] + '/..')

import click
# from matplotlib import pyplot as plt
from src.TD.slope_test import slope_test
from src.utils.test_cli_helper import test_cli_helper
# from src.plots.plot_VLE import plot_VLE
# from src.plots.plot_VLE import plot_slope_test


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
def slope(compound1, compound2, dataset):

    def test_fn(table, system_name, dataset_name):
        print(system_name, dataset_name)
        slope_test(table, compound1, compound2)

    test_cli_helper(compound1, compound2, dataset, test_fn)


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    slope()
