from ..Model import Model


class Vapor_Model(Model):

    def __init__(self, name, fun, n_params, params0, param_names, param_labels=None, display_name=None):
        """
            Vapor pressure model, see Model for generic params.

            fun (function): the model function itself as p[kPa] = f(T[K], *params)
        """
        # pylint: disable=useless-parent-delegation
        super().__init__(name, fun, n_params, params0, param_names, param_labels, display_name)
