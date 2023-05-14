import numpy as np
from matplotlib import pyplot as plt
from src.config import antoine_bounds_rel_tol, x_points_smooth_plot
from src.utils.open_tsv import open_tsv
from src.utils.Result import Result
from src.utils.errors import AppException


# prepare printable plot of Antoine per compound
# then plt.show() or plt.savefig('foo.png') must be called
class Antoine(Result):

    def __init__(self, compound):
        super().__init__()
        self.compound = compound
        self.get_from_data()

    # for the given compound code, get Antoine function as lambda T, T_min of data, T_max of data
    def get_from_data(self):
        consts = open_tsv('data/Antoine.tsv')
        matches = list(filter(lambda row: row[0].upper() == self.compound.upper(), consts))

        if len(matches) == 0:
            raise AppException(f'ERROR: No Antoine data for compound {self.compound}!')
        if len(matches) > 1:
            raise AppException(f'ERROR: Multiple Antoine data for compound {self.compound}, only one is permissible!')

        cells = list(filter(bool, matches[0]))
        cells = list(map(float, cells[1:]))
        if len(cells) != 5:
            raise AppException(
                f'ERROR: Corrupt Antoine data for compound {self.compound}, there must be 5 columns besides label, but {len(cells)} found:\n{str(cells)}'
            )
        C1, C2, C3, self.T_min, self.T_max = map(float, cells)

        self.antoine_fun = lambda T: np.exp(C1 + C2 / (T+C3))

    # checks if queried T_min, T_max fall within the Antoine T_min, T_max (with tolerance)
    def check_T_bounds(self, T_min_query, T_max_query):
        T_int = self.T_max - self.T_min
        template = 'WARNING: Temperature extrapolation of Antoine function for {compound}: queried {extrem} T = {T_query:.1f}, while Antoine {extrem} T = {T_ant:.1f}'

        if T_min_query < self.T_min - antoine_bounds_rel_tol*T_int:
            self.warn(template.format(extrem='min', compound=self.compound, T_query=T_min_query, T_ant=self.T_min))

        if T_max_query > self.T_max + antoine_bounds_rel_tol*T_int:
            self.warn(template.format(extrem='max', compound=self.compound, T_query=T_max_query, T_ant=self.T_max))

    def plot(self):
        T = np.linspace(self.T_min, self.T_max, num=x_points_smooth_plot)
        p = self.antoine_fun(T)
        plt.plot(T, p, '-k')
        plt.title(f'Vapor pressure for {self.compound}')
        plt.xlabel('T [K]')
        plt.ylabel('p [kPa]')
