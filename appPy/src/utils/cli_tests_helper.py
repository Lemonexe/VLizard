from src.utils.get_VLE_data import get_VLE_data


# helper to reduce boilerplate for TD test cli
# the CLI functions wrap this one, passing through args + test_fn callback to do test and parse results
# test_fn: lambda table, system_name, dataset_name: None
def cli_tests_helper(compound1, compound2, dataset_name, test_fn):

    system_name = f'{compound1}-{compound2}'
    if compound1 > compound2:
        system_name = f'{compound2}-{compound1}'

    try:
        (VLE_data, name_map) = get_VLE_data(system_name)
    except ValueError as err:
        raise SystemExit(err) from err

    if dataset_name:
        dataset_name = dataset_name.strip()
        if not dataset_name in name_map:
            raise SystemExit(f'the dataset {dataset_name} was not found in system {system_name}!')
        test_fn(VLE_data[name_map.index(dataset_name)], system_name, dataset_name)
    else:
        for i, name in enumerate(name_map):
            test_fn(VLE_data[i], system_name, name)
