import os
from .errors import AppException
from .echo import warn_echo


# check if the system of compounds exists in given order, or in swapped order, or raise AppException if system not exists
# returns tuple of compounds in correct order
def validate_system_or_swap(compound1, compound2):
    # first try in the given order
    try:
        try_system_dir_path(get_system_path(compound1=compound1, compound2=compound2))
        return (compound1, compound2)

    # then try to swap it around with warning
    except FileNotFoundError:
        try:
            try_system_dir_path(get_system_path(compound1=compound2, compound2=compound1))
            warn_echo(f'WARNING: compounds were swapped as {compound2}-{compound1} (that system was found)\n')
            return (compound2, compound1)

        # but if nothing is found either, throw the original error, not the swapped one
        except FileNotFoundError as exc:
            system_dir_names = [f.name for f in os.scandir(os.path.join('data', 'VLE')) if f.is_dir()]
            raise AppException(
                f'The system {compound1}-{compound2} does not exist in your data!\nAvailable systems: {", ".join(system_dir_names)}'
            ) from exc


# throw if system dir does not exist at given path
def try_system_dir_path(system_dir_path):
    if not os.path.exists(system_dir_path):
        raise FileNotFoundError(f'System does not exist at {system_dir_path}')


# get directory path where data is stored for the given system
# assumes valid system
def get_system_path(compound1, compound2):
    system_name = f'{compound1}-{compound2}'
    system_dir_path = os.path.join('data', 'VLE', system_name)
    return system_dir_path
