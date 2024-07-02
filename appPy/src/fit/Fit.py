from src.utils.Result import Result
from src.utils.errors import AppException
from src.utils.models import get_model_by_name


class Fit(Result):

    def __init__(self, supported_models, model_name, params0, const_param_names=None):
        """
        Create an abstract template for non-linear regression problem with a selected model and initial params.

        supported_models (list of Vapor_Model or VLE_Model): list of supported models.
        model_name (str): name of the model to be fitted.
        params0 (list of float): initial estimate of model parameters (ordered).
        const_param_names (list of str): names of parameter names to be kept constant during optimization.
        """
        super().__init__()
        self.keys_to_serialize = [
            'is_optimized', 'nparams', 'nparams0', 'RMS_init', 'RMS_final', 'AAD_init', 'AAD_final'
        ]
        self.supported_models = supported_models
        self.is_optimized = False  # whether optimization has been performed

        self.model = get_model_by_name(supported_models, model_name)
        self.params0, self.nparams0 = self.__parse_params0(params0)  # initial params as np.array, and as dict
        self.params = self.params0  # optimization result params as np.array
        self.nparams = self.nparams0

        self.const_param_names = self.__parse_const_param_names(const_param_names)

        # initial and final objective function values
        self.RMS_init = None
        self.AAD_init = None
        self.RMS_final = None
        self.AAD_final = None

    def set_named_params(self, params):
        """Compose vector of ordered params into an ordered dict of named params."""
        return dict(zip(self.model.param_names, params))

    def __parse_params0(self, params0):
        """
        Parse & validate initial params, use either given params or default model params as initial estimate.
        params0: either ordered list of float, or named params as ordered key:value dict
        """
        model = self.model
        if not params0: return model.params0, dict(zip(model.param_names, model.params0))
        if isinstance(params0, dict):
            nparams0 = params0
            params0 = [params0[key] for key in model.param_names]
        else:
            nparams0 = dict(zip(model.param_names, params0))
        if len(params0) != model.n_params:
            raise AppException(f'{model.display_name} model expects {model.n_params} parameters, got {len(params0)}!')
        return params0, nparams0

    def __parse_const_param_names(self, const_param_names):
        """Parse & validate const_param_names."""
        model = self.model
        default = model.always_const_param_names or []
        if not const_param_names: return default
        for name in const_param_names:
            if name not in model.param_names:
                raise AppException(f'{model.display_name} has parameters {", ".join(model.param_names)}, got {name}!')
        return default + const_param_names
