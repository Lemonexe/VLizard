import os
import shutil
from .errors import AppException
from .io.echo import warn_echo


def get_all_system_dir_names():
    """
    Get list of all system directory names in the VLE data directory.

    return (list(str)): names of all VLE systems
    """
    return [f.name for f in os.scandir(os.path.join('data', 'VLE')) if f.is_dir()]


def validate_system_or_swap(compound1, compound2):
    """
    Check if the system of two compounds exists in given order, or in swapped order, or throw if system doesn't exist.

    compound1, compound2 (str): names of compounds in the system
    return tuple: compound1, compound2 in correct order.
    """
    # first try in the given order
    if os.path.exists(get_system_path(compound1=compound1, compound2=compound2)):
        return compound1, compound2

    # then try to swap it around with warning
    if os.path.exists(get_system_path(compound1=compound2, compound2=compound1)):
        warn_echo(f'WARNING: compounds were swapped as {compound2}-{compound1} (that system was found)\n')
        return compound2, compound1

    # but if nothing is found either, throw & list available system
    csv = ', '.join(get_all_system_dir_names())
    msg = f'The system {compound1}-{compound2} does not exist in your data!\nAvailable systems: {csv}'
    raise AppException(msg)


def get_system_path(compound1, compound2):
    """
    Get directory path where data is stored for the given system of two compounds.
    Assumes valid system in given order.

    compound1, compound2 (str): names of compounds in the system
    return str: path to the binary system directory
    """
    system_name = f'{compound1}-{compound2}'
    system_dir_path = os.path.join('data', 'VLE', system_name)
    return system_dir_path


def parse_system_dir_name(system_dir_name):
    """
    Get compound names from system directory name.

    system_dir_name (str): name of the system directory
    return tuple: compound1, compound2
    """
    return system_dir_name.split('-')


def delete_system(compound1, compound2):
    """
    Delete the whole system directory and all its contents.
    Assumes valid system in given order.

    compound1, compound2 (str): names of compounds in the system
    """
    system_dir_path = get_system_path(compound1, compound2)
    shutil.rmtree(system_dir_path)
