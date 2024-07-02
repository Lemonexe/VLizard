import numpy as np
from src.config import cfg
from src.utils.errors import AppException
from src.utils.io.echo import echo, ok_echo, warn_echo, err_echo, underline_echo
from src.utils.models import get_model_by_name
from src.fit.persist_fit import get_persisted_fit
from src.fit.utils import RMS
from src.TD.VLE_models.supported_models import supported_models
from .VLE import VLE


class VN_test(VLE):

    def __init__(self, compound1, compound2, dataset_name, model_name):
        """
        Perform van Ness test as object with results and methods for reporting & visualization.

        compound1, compound2 (str): names of compounds
        dataset_name (str): name of dataset
        model_name (str): existing persisted fit, identified by name of the VLE model
        """
        super().__init__(compound1, compound2, dataset_name)
        self.keys_to_serialize = ['RMS', 'consistency_index', 'is_consistent', 'model_display_name', 'res']

        self.persisted_fit = pfit = get_persisted_fit(compound1, compound2, model_name)
        if pfit is None: raise AppException(f'Persisted {model_name} fit for {compound1}-{compound2} not found')
        self.model = model = get_model_by_name(supported_models, model_name)
        self.model_display_name = model.display_name

        nparams = pfit['results']['nparams']
        params = [nparams[key] for key in model.param_names]
        gamma_1_calc, gamma_2_calc = model.fun(self.x_1, self.T, *params)

        # calculate residuals of van Ness test
        self.res = np.log(self.gamma_1 / self.gamma_2) - np.log(gamma_1_calc / gamma_2_calc)
        self.RMS = RMS(self.res)
        self.consistency_index = np.min((np.ceil(self.RMS / cfg.van_Ness_marking_interval), cfg.van_Ness_max_mark))
        self.is_consistent = self.consistency_index < cfg.van_Ness_max_mark

    def get_title(self):
        return f'van Ness test for {super().get_title()}'

    def report(self):
        underline_echo(self.get_title())
        self.report_warnings()

        msg = f'Consistency index = {self.consistency_index:.0f}'
        if self.consistency_index < cfg.van_Ness_max_mark / 2: ok_echo(msg)
        elif self.consistency_index < cfg.van_Ness_max_mark: warn_echo(msg)
        else: err_echo(msg)
        echo('')
        echo(f'RMS = {(self.RMS*100):.1f} %')
        echo('')
