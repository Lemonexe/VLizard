import os
import numpy as np
from scipy.optimize import root
from matplotlib import pyplot as plt
from src.config import atm, C2K, T_bounds_rel_tol, T_boil_tol, x_points_smooth_plot
from src.utils.io.json import open_json
from src.utils.io.echo import echo, underline_echo
from src.utils.Result import Result
from src.utils.errors import AppException
from src.TD.vapor_models.wagner import wagner_model
from src.TD.vapor_models.antoine import antoine_model

# supported models in order of preference, descending
supported_models = [wagner_model, antoine_model]
supported_model_names = [model.name for model in supported_models]


# create a vapor pressure function for a given compound
class Vapor(Result):

    def __init__(self, compound):
        super().__init__()
        self.compound = compound

        json_data = self.__get_json_data()
        self.model = model = self.__get_preferred_model(json_data)
        json_model_data = json_data[model.name]
        self.params = params = [json_model_data[param_name] for param_name in model.param_names]
        self.ps_fun = lambda T: model.fun(T, *params)  # p [kPa] = f(T [K])

        self.T_min = json_model_data['T_min']
        self.T_max = json_model_data['T_max']

    # get json data file for the given compound
    def __get_json_data(self):
        json_path = os.path.join('data/ps', self.compound + '.json')
        if not os.path.exists(json_path):
            raise AppException(f'No vapor pressure data for compound {self.compound}!')

        def on_error(_exc):
            raise AppException(f'Vapor pressure data file {json_path} is not a valid json!')

        return open_json(json_path, on_error=on_error)

    # get preferred vapor pressure model for the given .json data
    def __get_preferred_model(self, json_data):
        # either the preferred model has been set explicitly
        setting = json_data['preferred_model']
        if setting and setting in supported_model_names:
            return supported_models[supported_model_names.index(setting)]

        # or find the first available model in preference order
        available_models = json_data.keys()
        for model, model_name in zip(supported_models, supported_model_names):
            if model_name in available_models:
                return model

        # no model found
        raise AppException(f'Invalid vapor pressure data for compound {self.compound}!')

    # checks if queried temp conforms to vapor pressure function T_min, T_max (with tolerance)
    # either enter one temperature T_min_query, or an interval T_min_query, T_max_query
    def check_T_bounds(self, T_min_query, T_max_query=None):
        if not T_max_query: T_max_query = T_min_query
        T_int = self.T_max - self.T_min
        template = lambda extrem, T_query, T_data: f'Temperature extrapolation of vapor pressure for {self.compound}: queried T = {T_query:.1f} K, while T_{extrem} = {T_data:.1f} K'

        if T_min_query < self.T_min - T_bounds_rel_tol*T_int:
            self.warn(template(extrem='min', T_query=T_min_query, T_data=self.T_min))
        if T_max_query > self.T_max + T_bounds_rel_tol*T_int:
            self.warn(template(extrem='max', T_query=T_max_query, T_data=self.T_max))

    def get_title(self):
        return f'Vapor pressure for {self.compound}'

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        T_min, T_max = self.T_min, self.T_max
        echo(f'Vapor pressure function: {self.model.name}')
        echo(f'T_min = {(T_min-C2K):5.1f}°C')
        echo(f'T_max = {(T_max-C2K):5.1f}°C')

        echo(f'ps_min = {self.ps_fun(T_min):.3g} kPa')
        echo(f'ps_max = {self.ps_fun(T_max):.3g} kPa')

        # try to find normal boiling point
        resid = lambda T: self.ps_fun(T) - atm
        sol = root(fun=resid, x0=400, tol=T_boil_tol)
        if sol.success:
            T_boil = sol.x[0]
            echo(f'T_boil(atm) = {(T_boil-C2K):.1f}°C')
        echo('')

    def plot(self):
        # smooth tabulation of curve
        T = np.linspace(self.T_min, self.T_max, x_points_smooth_plot)
        p = self.ps_fun(T)
        plt.figure()
        plt.plot(T - C2K, p, '-k')
        plt.title(self.get_title())
        plt.xlabel('T [°C]')
        plt.ylabel('p [kPa]')
        plt.ion()
        plt.show()
