from src.utils.errors import AppException


class Model:

    def __init__(self,
                 name,
                 fun,
                 n_params,
                 params0,
                 param_names,
                 param_labels=None,
                 display_name=None,
                 always_const_param_names=None):
        """
        Generic class for a mathematical Model, consists of the model function itself + important metadata.

        name (str): unique identifier of the model
        display_name (str): model name to be displayed
        fun (function): the model function itself
        n_params (int): number of model params
        params0 (list of float): a generic initial estimate of params for regression
        param_names (list of str): list of param identifiers
        param_labels (list of str): list of param descriptions
        always_const_param_names (list of str): list of param names that will always be kept constant during optimization
        """
        if n_params != len(params0) or n_params != len(param_names):
            raise AppException(f'n_params must match with params0 & param_names for model {name}!')

        self.name = name
        self.display_name = display_name if display_name else name
        self.fun = fun
        self.n_params = n_params
        self.params0 = params0
        self.param_names = param_names
        self.param_labels = param_labels
        self.always_const_param_names = always_const_param_names

    def serialize(self):
        """Serialize itself to a dict that can be converted to json."""
        return {
            'name': self.name,
            'display_name': self.display_name,
            'nparams0': dict(zip(self.param_names, self.params0)),
            'param_labels': dict(zip(self.param_names, self.param_labels or self.param_names)),
            'always_const_param_names': self.always_const_param_names,
        }
