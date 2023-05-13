import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.TD.Slope_test import Slope_test
from src.utils.get_VLE_data import list_VLE_tables
from src.utils.errors import AppException, CLI_error_boundary


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
@click.option('--noplot', is_flag=True, help='Suppress rendering of plots')
def cli_slope(compound1, compound2, dataset, noplot):
    """Perform slope test for COMPOUND1 code, COMPOUND2 code."""
    system_name = f'{compound1}-{compound2}'

    dataset_names = list_VLE_tables(compound1, compound2)

    def do_for_dataset(dataset):
        print(f'Slope test for {system_name}, {dataset}')
        slope_test = Slope_test(compound1, compound2, dataset)
        slope_test.report()

        if noplot: return
        slope_test.vle.plot_gamma()
        slope_test.render_plot_CLI()
        slope_test.plot_slope()
        slope_test.render_plot_CLI()

    if dataset:
        dataset = dataset.strip()
        if not dataset in dataset_names:
            raise AppException(f'ERROR: the dataset {dataset} was not found in system {system_name}!')
        do_for_dataset(dataset)
    else:
        for name in dataset_names:
            do_for_dataset(name)


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_slope)
