from src.utils.Result import Result
from src.utils.errors import AppException
from src.utils.io.echo import echo, underline_echo


class Fit(Result):

    def __init__(self, supported_models, model_name, params0, const_param_names=None):
        """
        Create an abstract template for non-linear regression problem with a selected model and initial params.
        WIP, currently just setup of the problem, but may be extended to include the optimization and serialization itself.

        supported_models (list of Vapor_Model or VLE_Model): list of supported models.
        model_name (str): name of the model to be fitted.
        params0 (list of float): initial estimate of model parameters (ordered).
        """
        super().__init__()
        self.keys_to_serialize = ['is_optimized', 'result_params']
        self.supported_models = supported_models
        self.supported_model_names = [model.name for model in supported_models]

        self.model = self.__parse_model(model_name)
        self.params0 = self.__parse_params0(params0)  # initial params

        self.const_param_names = self.__parse_const_param_names(const_param_names)  # param names to be kept constant

        self.params = self.params0  # result of optimization as vector of values
        self.result_params = self.set_named_params(self.params0)  # result of optimization as a dict of named values
        self.is_optimized = False  # whether optimization has been performed

        # initial and final objective function values
        self.RMS_init = None
        self.AAD_init = None
        self.RMS_final = None
        self.AAD_final = None

    def set_named_params(self, params):
        """Compose result_params vector into a self-descriptive dict."""
        return dict(zip(self.model.param_names, params))

    def __parse_model(self, model_name):
        """Parse model_name and check if it is appropriate for given datasets."""
        supported_model_names_lcase = [name.lower() for name in self.supported_model_names]
        if not model_name.lower() in supported_model_names_lcase:
            csv = ', '.join(self.supported_model_names)
            raise AppException(f'Unknown model {model_name}.\nAvailable models: {csv}')

        return self.supported_models[supported_model_names_lcase.index(model_name.lower())]

    def __parse_params0(self, params0):
        """Parse & validate params0, use either given params or default model params as initial estimate."""
        model = self.model
        if not params0: return model.params0
        if len(params0) != model.n_params:
            raise AppException(f'{model.display_name} model expects {model.n_params} parameters, got {len(params0)}!')
        return params0

    def __parse_const_param_names(self, const_param_names):
        """Parse & validate const_param_names."""
        model = self.model
        if not const_param_names: return []
        for name in const_param_names:
            if name not in model.param_names:
                raise AppException(f'{model.display_name} has parameters {", ".join(model.param_names)}, got {name}!')
        return const_param_names

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        if self.is_optimized: echo('Optimization complete with following parameters:')
        else: echo('Optimization skipped, using initial parameters:')
        for (name, value) in zip(self.model.param_names, self.params):
            echo(f'  {name} = {value:.4g}')

        echo('')
        echo(f'Initial RMS = {self.RMS_init:.3g}')
        echo(f'Initial AAD = {self.AAD_init:.3g}')
        if self.is_optimized:
            echo(f'Final RMS   = {self.RMS_final:.3g}')
            echo(f'Final AAD   = {self.AAD_final:.3g}')

    def get_title(self):
        return f'Regression of {self.model.display_name}'
