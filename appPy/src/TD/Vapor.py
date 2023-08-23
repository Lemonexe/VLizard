import numpy as np
from scipy.optimize import root
from matplotlib import pyplot as plt
from src.config import atm, C2K, T_bounds_rel_tol, T_boil_tol, x_points_smooth_plot
from src.utils.io.echo import echo, underline_echo
from src.utils.compounds import get_vapor_model_params
from src.utils.Result import Result
from src.utils.errors import AppException
from src.TD.vapor_models.wagner import wagner_model
from src.TD.vapor_models.antoine import antoine_model

# supported models in order of preference, descending
supported_models = [wagner_model, antoine_model]


# create a vapor pressure function for a given compound
def choose_vapor_model_params(compound):
    for model in supported_models:
        results = get_vapor_model_params(compound, model)
        if results: return model, *results
    raise AppException(f'No vapor pressure model found for {compound}!')


class Vapor(Result):

    def __init__(self, compound):
        super().__init__()
        self.compound = compound

        self.model, self.T_min, self.T_max, self.params = choose_vapor_model_params(compound)
        self.ps_fun = lambda T: self.model.fun(T, *self.params)  # p [kPa] = f(T [K])

    # checks if queried temp conforms to vapor pressure function T_min, T_max (with tolerance)
    # can receive one param (one temp point) or two params (temp interval)
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