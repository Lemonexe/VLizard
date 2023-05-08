import sys

sys.path.append(sys.path[0] + '/..')

import click
from matplotlib import pyplot as plt
from src.TD.slope_test import Slope_test
from src.utils.cli_tests_helper import cli_tests_helper


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
def slope(compound1, compound2, dataset):

    def test_fn(table, system_name, dataset_name):
        print(f'Slope test for {system_name}, {dataset_name}')
        slope_test = Slope_test(table, compound1, compound2)
        print(slope_test)
        slope_test.plot_gamma()
        plt.show()
        slope_test.plot_slope()
        plt.show()

    cli_tests_helper(compound1, compound2, dataset, test_fn)


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    slope()
