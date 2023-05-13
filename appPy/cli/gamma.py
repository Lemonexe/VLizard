import sys

sys.path.append(sys.path[0] + '/..')

import click
from src.utils.errors import CLI_error_boundary
from src.utils.do_datasets import do_datasets
from src.TD.VLE import VLE


@click.command()
@click.argument('compound1')
@click.argument('compound2')
@click.option('-d', '--dataset', help='Exact name of dataset, otherwise do all datasets of the system.')
@click.option('--noplot', is_flag=True, help='Suppress rendering of plots')
def cli_gamma(compound1, compound2, dataset, noplot):
    """Calculate activity coeffs for COMPOUND1 code, COMPOUND2 code."""
    system_name = f'{compound1}-{compound2}'

    def do_for_dataset(dataset):
        print(f'Slope test for {system_name}, {dataset}')
        vle = VLE(compound1, compound2, dataset)
        vle.report()

        if noplot: return
        vle.plot_gamma()
        vle.render_plot_CLI()

    do_datasets(compound1, compound2, dataset, do_for_dataset)


# pylint: disable=no-value-for-parameter
if __name__ == '__main__':
    CLI_error_boundary(cli_gamma)
