# wrapper for the model function itself that provides important metadata
class VLE_Model:

    def __init__(self, name, fun, n_params, params0, param_names, is_gamma_T_fun, display_name=None):
        """
        Wrap the model function itself with important metadata.

        name (str): unique identifier of the model
        display_name (str): model name to be displayed
        fun (function): the model function itself as [gamma_1, gamma_2] = f(x_1, T[K], *params)
        n_params (int): number of params
        params0 (list of float): a generic initial estimate of params
        param_names (list of str): list of param identifiers
        is_gamma_T_fun (bool): whether is gamma actually dependent on temperature
        """
        self.name = name
        self.display_name = display_name if display_name else name
        self.fun = fun
        self.n_params = n_params
        self.params0 = params0
        self.param_names = param_names
        self.is_gamma_T_fun = is_gamma_T_fun
