from src.utils.errors import AppException
from src.utils.get_VLE_data import list_VLE_tables


# helper for those CLI functions which take a binary compounds, and optionally a dataset (otherwise lot of boilerplate)
def do_datasets(compound1, compound2, dataset, do_for_dataset):
    system_name = f'{compound1}-{compound2}'

    dataset_names = list_VLE_tables(compound1, compound2)  # may throw AppException

    if dataset:
        dataset = dataset.strip()
        if not dataset in dataset_names:
            raise AppException(f'ERROR: the dataset {dataset} was not found in system {system_name}!')
        do_for_dataset(dataset)
    else:
        for name in dataset_names:
            do_for_dataset(name)
