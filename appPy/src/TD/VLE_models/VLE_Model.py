from ..Model import Model


class VLE_Model(Model):

    def __init__(self,
                 name,
                 fun,
                 n_params,
                 params0,
                 param_names,
                 is_gamma_T_fun,
                 param_labels=None,
                 display_name=None,
                 always_const_param_names=None):
        """
        VLE activity coefficient model, see Model for generic params.

        fun (function): the model function itself as [gamma_1, gamma_2] = f(x_1, T[K], *params)
        is_gamma_T_fun (bool): whether is gamma actually dependent on temperature
        """
        super().__init__(name, fun, n_params, params0, param_names, param_labels, display_name,
                         always_const_param_names)
        self.is_gamma_T_fun = is_gamma_T_fun

    def serialize(self):
        payload = super().serialize()
        payload['is_gamma_T_fun'] = self.is_gamma_T_fun
        return payload
