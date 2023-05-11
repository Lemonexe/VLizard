import sys

sys.path.append(sys.path[0] + '/..')

import click
from matplotlib import pyplot as plt
from src.TD.Slope_test import Slope_test
from src.utils.get_VLE_data import list_VLE_tables
from src.utils.get_system_name import get_system_name


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
def cli_slope(compound1, compound2, dataset):
    """Perform slope test for COMPOUND1 code, COMPOUND2 code."""
    system_name = get_system_name(compound1, compound2)

    try:
        dataset_names = list_VLE_tables(compound1, compound2)
    except ValueError as err:
        raise SystemExit(err) from err

    def do_for_dataset(dataset):
        print(f'Slope test for {system_name}, {dataset}')
        slope_test = Slope_test(compound1, compound2, dataset)
        slope_test.check_status_CLI()
        print(slope_test)
        slope_test.vle.plot_gamma()
        plt.show()
        slope_test.plot_slope()
        plt.show()

    if dataset:
        dataset = dataset.strip()
        if not dataset in dataset_names:
            raise SystemExit(f'ERROR: the dataset {dataset} was not found in system {system_name}!')
        do_for_dataset(dataset)
    else:
        for name in dataset_names:
            do_for_dataset(name)


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    cli_slope()
