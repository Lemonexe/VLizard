from src.utils.errors import AppException
from src.utils.get_VLE_data import list_VLE_tables
from src.utils.echo import warn_echo


# helper for those CLI functions which take a binary compounds, and optionally a dataset (otherwise lot of boilerplate)
def do_datasets(compound1, compound2, dataset, do_for_dataset):
    # first try in the given order
    try:
        dataset_names = list_VLE_tables(compound1, compound2)

    # then try to swap it around with warning
    except AppException as err1:
        try:
            (compound1, compound2) = (compound2, compound1)
            dataset_names = list_VLE_tables(compound1, compound2)
            warn_echo(f'WARNING: compounds were swapped as {compound1}-{compound2} (that system was found)\n')

        # but if nothing is found either, throw the original error, not the swapped one
        except AppException as err2:
            raise AppException(err1) from err2

    # do either for one specified dataset, or all found datasets
    if dataset:
        dataset = dataset.strip()
        if not dataset in dataset_names:
            message = f'the dataset {dataset} was not found in system {compound1}-{compound2}!\nAvailable datasets: {", ".join(dataset_names)}'
            raise AppException(message)
        do_for_dataset(compound1, compound2, dataset)
    else:
        for name in dataset_names:
            do_for_dataset(compound1, compound2, name)


# plt.ion() enables pyplot interactive mode, which allows rendering charts async (open chart windows all at once instead of one by one)
# however, the chart windows will close when end of program is reached, so the program has to be kept alive as long as user wishes
def pause_to_keep_charts():
    input("Press ENTER to end the program (closes all charts)")
