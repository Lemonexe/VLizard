import numpy as np
from scipy.optimize import root
from src.config import cfg
from src.utils.io.echo import echo, underline_echo
from src.utils.compounds import get_preferred_vapor_model
from src.utils.Result import Result


class Vapor(Result):

    def __init__(self, compound):
        """
        Create a vapor pressure analysis for given pure compound.

        compound (str): compound name
        """
        super().__init__()
        self.keys_to_serialize = ['compound', 'model_name', 'T_min', 'T_max', 'T_boil']

        self.compound = compound

        self.model, self.T_min, self.T_max, self.params = get_preferred_vapor_model(compound)
        self.model_name = self.model.name
        self.ps_fun = lambda T: self.model.fun(T, *self.params)  # p [kPa] = f(T [K])

        self.T_boil = self.get_T_boil()

        self.T_tab = np.linspace(self.T_min, self.T_max, cfg.x_points_smooth_plot)
        self.p_tab = self.ps_fun(self.T_tab)

    def get_T_boil(self):
        """Numerically calculate normal boiling point from vapor pressure function. """
        resid = lambda T: self.ps_fun(T) - cfg.atm
        T_boil_init = self.est_T_boil()
        sol = root(fun=resid, x0=T_boil_init, tol=cfg.T_boil_tol)
        return sol.x[0] if sol.success else None

    def est_T_boil(self):
        """Estimate normal boiling point from vapor pressure function using T = a * p**n. """
        T1, T2 = self.T_min, self.T_max
        p1, p2 = self.ps_fun(T1), self.ps_fun(T2)
        n = np.log(T1 / T2) / np.log(p1 / p2)
        a = np.exp(np.log(T1) - n * np.log(p1))
        return a * cfg.atm**n

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

        if T_min_query < self.T_min - cfg.T_bounds_rel_tol * T_int:
            self.warn(template(extrem='min', T_query=T_min_query, T_data=self.T_min))
        if T_max_query > self.T_max + cfg.T_bounds_rel_tol * T_int:
            self.warn(template(extrem='max', T_query=T_max_query, T_data=self.T_max))

    def get_title(self):
        return f'Vapor pressure for {self.compound}'

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        T_min, T_max = self.T_min, self.T_max
        echo(f'Vapor pressure function: {self.model.name}')
        echo(f'T_min = {(T_min-cfg.C2K):5.1f}°C')
        echo(f'T_max = {(T_max-cfg.C2K):5.1f}°C')

        echo(f'ps_min = {self.ps_fun(T_min):.3g} kPa')
        echo(f'ps_max = {self.ps_fun(T_max):.3g} kPa')
        if self.T_boil: echo(f'T_boil(atm) = {(self.T_boil-cfg.C2K):.1f}°C')
        echo('')
