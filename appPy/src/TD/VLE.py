import numpy as np
from src.config import cfg
from src.utils.io.echo import echo, underline_echo
from src.utils.vector import serialize_cols
from src.utils.io.tsv import matrix2tsv
from src.utils.Result import Result
from src.utils.datasets import get_dataset_VLE_data
from src.utils.UoM import convert_T, convert_p
from .Vapor import Vapor


class VLE(Result):

    def __init__(self, compound1, compound2, dataset_name):
        """
        Create a VLE analysis for a given dataset of binary system, using data from files.

        compound1, compound2 (str): names of compounds
        dataset_name (str): name of dataset
        """
        super().__init__()
        self.keys_to_serialize = [
            'p', 'T', 'x_1', 'y_1', 'gamma_1', 'gamma_2', 'ps_1', 'ps_2', 'p_avg', 'T_avg', 'is_isobaric'
        ]
        self.compound1 = compound1
        self.compound2 = compound2
        self.dataset_name = dataset_name

        (self.p, self.T, self.x_1, self.y_1) = get_dataset_VLE_data(compound1, compound2, dataset_name)

        self.p_avg = np.mean(self.p)
        self.T_avg = np.mean(self.T)
        self.is_isobaric = self.decide_isobaric()

        self.x_2 = 1 - self.x_1
        self.y_2 = 1 - self.y_1

        vapor_1 = Vapor(compound1)
        vapor_2 = Vapor(compound2)
        T_data_bounds = (np.min(self.T), np.max(self.T))
        vapor_1.check_T_bounds(*T_data_bounds)
        vapor_2.check_T_bounds(*T_data_bounds)
        self.merge_warnings(vapor_1, vapor_2)
        self.ps_fun_1 = vapor_1.ps_fun
        self.ps_fun_2 = vapor_2.ps_fun

        self.ps_1 = self.ps_fun_1(self.T)
        self.ps_2 = self.ps_fun_2(self.T)

        self.gamma_1 = self.y_1 * self.p / self.x_1 / self.ps_1
        self.gamma_2 = self.y_2 * self.p / self.x_2 / self.ps_2

    def decide_isobaric(self):
        """
        Decide if the dataset is isobaric, else isothermal, based on whichever quantity has larger coefficient of variation
        """
        p_std = np.std(self.p)
        T_std = np.std(self.T)
        if self.p_avg <= 0 or self.T_avg <= 0: return None
        p_cv = p_std / self.p_avg
        T_cv = T_std / self.T_avg
        return p_cv < T_cv

    def report(self):
        underline_echo(f'Activity coeffs for {self.get_title()}')
        if self.is_isobaric is not None:
            isobaric_label = f'isobaric at {convert_p(self.p_avg):.1f} {cfg.UoM_p}'
            isothermal_label = f'isothermal at {convert_T(self.T_avg):.3g} {cfg.UoM_T}'
            echo(f'data is {isobaric_label if self.is_isobaric else isothermal_label}')
        self.report_warnings()

        # pretty-print a table of following vectors
        headlines = ['x1', 'γ1', 'γ2']
        table = serialize_cols(self.x_1, self.gamma_1, self.gamma_2)
        echo(matrix2tsv(table, headlines=headlines, format_spec='{:6.3f}'))
        echo('')

    def get_title(self):
        return f'{self.compound1}-{self.compound2}, {self.dataset_name}'
