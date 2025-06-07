from src.config import cst
from src.config import cfg

# kPa is base; the ratio means "unit is this much kPa"
p_units = {'Pa': 1000, 'mbar': 10, 'kPa': 1, 'bar': 0.01, 'MPa': 0.001, 'psi': 0.1450377377}


def convert_T(T):
    """
    Convert temperature from Kelvin to a unit of measure specified in user config.

    T (float): temperature in Kelvin
    return (float): temperature in specified unit of measure
    """
    if cfg.UoM_T.lower() == 'k':
        return T
    if cfg.UoM_T.lower() == '°c':
        return T - cst.C2K
    if cfg.UoM_T.lower() == '°f':
        return 9 / 5 * (T + cst.TF0)
    raise ValueError(f'Unknown UoM_T: {cfg.UoM_T}')


def convert_p(p):
    """
    Convert pressure from kPa to a unit of measure specified in user config.

    p (float): pressure in kPa
    return (float): pressure in specified unit of measure
    """
    for unit, factor in p_units.items():
        if cfg.UoM_p.lower() == unit.lower():
            return p * factor
    raise ValueError(f'Unknown UoM_p: {cfg.UoM_p}')
