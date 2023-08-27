# wrapper for the model function itself that provides important metadata
class Vapor_Model:

    def __init__(self, name, fun, n_params, params0, param_names):
        """
        Wrap the model function itself with important metadata.

        name (str): unique identifier of the model
        fun (function): the model function itself as p[kPa] = f(T[K], *params)
        n_params (int): number of model params
        params0 (list of float): a generic initial estimate of params for regression
        param_names (list of str): list of param identifiers
        """
        self.name = name
        self.fun = fun
        self.n_params = n_params
        self.params0 = params0
        self.param_names = param_names
