from src.utils.errors import AppException
from src.utils.get_VLE_data import list_VLE_tables
from src.utils.echo import warn_echo


# get datasets of a binary system, either in the given order, or swapped around
def get_all_datasets(compound1, compound2):
    # first try in the given order
    try:
        all_dataset_names = list_VLE_tables(compound1, compound2)

    # then try to swap it around with warning
    except AppException as err1:
        try:
            (compound1, compound2) = (compound2, compound1)
            all_dataset_names = list_VLE_tables(compound1, compound2)
            warn_echo(f'WARNING: compounds were swapped as {compound1}-{compound2} (that system was found)\n')

        # but if nothing is found either, throw the original error, not the swapped one
        except AppException as err2:
            raise AppException(err1) from err2

    return all_dataset_names

# for a binary system, parse the 'datasets' comma-separated string and return a list of valid dataset names
def parse_datasets(compound1, compound2, datasets):
    all_dataset_names = get_all_datasets(compound1, compound2)

    if datasets:
        dataset_names = list(filter(bool, map(lambda str: str.strip(), datasets.split(','))))
        if len(dataset_names) == 0:
            raise AppException('No datasets given! Omit the parameter to list all datasets.')
        for dataset_name in dataset_names:
            validate_dataset(compound1, compound2, dataset_name, all_dataset_names)
        return dataset_names
    else:
        return all_dataset_names

# wrapper for parse_datasets that fires callback on each valid dataset name
def do_datasets(compound1, compound2, datasets, do_for_dataset):
    dataset_names = parse_datasets(compound1, compound2, datasets)
    for dataset_name in dataset_names:
        do_for_dataset(compound1, compound2, dataset_name)



# throw if dataset does not exist in the system
def validate_dataset(compound1, compound2, dataset, all_dataset_names):
    if not dataset in all_dataset_names:
        message = f'the dataset {dataset} was not found in system {compound1}-{compound2}!\nAvailable datasets: {", ".join(all_dataset_names)}'
        raise AppException(message)
