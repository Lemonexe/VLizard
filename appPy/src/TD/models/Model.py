# wrapper for the model function itself that provides important metadata
class Model:

    def __init__(self, name, fun, n_params, params0, param_names, is_gamma_T_fun):
        self.name = name
        self.fun = fun  # the model function itself as [gamma_1, gamma_2] = f(x_1, T, *params)
        self.n_params = n_params  # number of params
        self.params0 = params0  # a generic initial estimate of params
        self.param_names = param_names
        self.is_gamma_T_fun = is_gamma_T_fun  # is gamma actually a function of temperature?
