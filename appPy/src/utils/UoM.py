from src.config import cst
from src.config import cfg

p_units = {'Pa': 1000, 'kPa': 1, 'bar': 0.01, 'MPa': 0.001}


def convert_T(T):
    if cfg.UoM_T.lower() == 'k':
        return T
    if cfg.UoM_T.lower() == '°c':
        return T - cst.C2K
    raise ValueError(f'Unknown UoM_T: {cfg.UoM_T}')


def convert_p(p):
    for unit, factor in p_units.items():
        if cfg.UoM_p.lower() == unit.lower():
            return p * factor
    raise ValueError(f'Unknown UoM_p: {cfg.UoM_p}')
