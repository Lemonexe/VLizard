from src.utils.errors import AppException
from src.utils.get_VLE_data import list_VLE_tables


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
            print(f'WARNING: compounds were swapped as {compound1}-{compound2} (that system was found)')

        # but if nothing is found either, throw the original error, not the swapped one
        except AppException as err2:
            raise AppException(err1) from err2

    if dataset:
        dataset = dataset.strip()
        if not dataset in dataset_names:
            raise AppException(f'ERROR: the dataset {dataset} was not found in system {compound1}-{compound2}!')
        do_for_dataset(compound1, compound2, dataset)
    else:
        for name in dataset_names:
            do_for_dataset(compound1, compound2, name)
