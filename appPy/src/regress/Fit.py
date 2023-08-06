import numpy as np
from matplotlib import pyplot as plt
from scipy.optimize import least_squares
from src.utils.Result import Result
from src.utils.errors import AppException
from src.utils.do_datasets import parse_datasets
from src.utils.echo import echo, ok_echo, err_echo, underline_echo

supported_models = ['vanLaar', 'NRTL']
default_model = supported_models[0]
class Fit(Result):

    def __init__(self, compound1, compound2, model, datasets, params):
        super().__init__()
        self.compound1 = compound1
        self.compound2 = compound2
        self.model = model
        if not model in supported_models:
            raise AppException(f'Unknown model {model}.\nAvailable models: {", ".join(supported_models)}')

        self.dataset_names = parse_datasets(compound1, compound2, datasets)
        if model == 'vanLaar' and len(self.dataset_names) != 1:
            self.warn(f'van Laar model is isothermal, be cautious when fitting multiple datasets of different pressure')

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

    def get_title(self):
        return f'Regression of {self.model} on {self.compound1}-{self.compound2} ({", ".join(self.dataset_names)})'

    def plot_xy(self):
        pass

    def plot_Txy(self):
        pass

    def plot_gamma(self):
        pass