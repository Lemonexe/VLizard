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


def choose_vapor_model_params(compound):
    """
    Choose model of vapor pressure.

    compound (str): compound name
    return (tuple): Vapor_Model, T_min [K], T_max [K], *params
    """
    for model in supported_models:
        results = get_vapor_model_params(compound, model)
        if results: return model, *results
    raise AppException(f'No vapor pressure model found for {compound}!')


class Vapor(Result):

    def __init__(self, compound):
        """
        Create a vapor pressure analysis for given pure compound.

        compound (str): compound name
        """
        super().__init__()
        self.compound = compound

        self.model, self.T_min, self.T_max, self.params = choose_vapor_model_params(compound)
        self.ps_fun = lambda T: self.model.fun(T, *self.params)  # p [kPa] = f(T [K])

        # try to find normal boiling point
        resid = lambda T: self.ps_fun(T) - atm
        sol = root(fun=resid, x0=400, tol=T_boil_tol)  # 400 K as initial estimate
        self.T_boil = sol.x[0] if sol.success else None

        self.T_tab = np.linspace(self.T_min, self.T_max, x_points_smooth_plot)
        self.p_tab = self.ps_fun(self.T_tab)

    def check_T_bounds(self, T_min_query, T_max_query=None):
        """
        Check if queried temperature conforms to T_min, T_max of vapor pressure function with tolerance.
        Either a single point or an interval can be queried.

        T_min_query (float): queried lower interval bound, or the single point [K]
        T_max_query (float): queried upper interval bound [K]
        """
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
        if self.T_boil: echo(f'T_boil(atm) = {(self.T_boil-C2K):.1f}°C')
        echo('')

    def plot(self):
        plt.figure()
        plt.plot(self.T_tab - C2K, self.p_tab, '-k')
        plt.title(self.get_title())
        plt.xlabel('T [°C]')
        plt.ylabel('p [kPa]')
        plt.ion()
        plt.show()
