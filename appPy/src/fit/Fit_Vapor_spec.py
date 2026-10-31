"""Exercise the scientific and plotting dependencies together on known vapor data."""
import numpy as np
import pytest
from src.plot.Fit_Vapor_plot import Fit_Vapor_plot
from src.TD.vapor_models.antoine import antoine_fun


@pytest.mark.parametrize('fixed_names', [[], ['C']])
def test_vapor_fitting_and_svg(fixed_names):
    temperatures = np.linspace(300, 370, 25)
    pressures = antoine_fun(temperatures, 14.5, -3500, -100)
    initial_params = [14.4, -3450, -100]
    fit = Fit_Vapor_plot('synthetic', 'Antoine', pressures, temperatures, initial_params)
    fit.const_param_names = fixed_names

    fit.optimize_p()
    fit.optimize_T_p()
    fit.tabulate()

    assert fit.is_p_optimized
    assert fit.is_T_p_optimized
    assert np.isfinite(fit.params_p).all()
    assert np.isfinite(fit.params_T_p).all()
    assert fit.RMS_p < fit.RMS0
    assert fit.RMS_T_p < fit.RMS0
    if fixed_names:
        assert fit.nparams_p['C'] == initial_params[2]
        assert fit.nparams_T_p['C'] == initial_params[2]
    assert '<svg' in fit.plot_p(mode='svg')
    assert '<svg' in fit.plot_T_p(mode='svg')
