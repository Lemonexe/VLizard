# wrapper for the model function itself that provides important metadata
class Vapor_Model:

    def __init__(self, name, fun, n_params, params0, param_names):
        self.name = name
        self.fun = fun  # the model function itself as p = f(T, *params)
        self.n_params = n_params  # number of params
        self.params0 = params0  # a generic initial estimate of params
        self.param_names = param_names
