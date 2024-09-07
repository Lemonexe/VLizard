import numpy as np
from src.utils.vector import pick_vector, overlay_vectors


def RMS(resid_vec):
    """
    Calculate root-mean-square

    resid_vec (np.array(n) or list of float): residuals
    return (float): RMS
    """
    return np.mean(np.square(np.array(resid_vec)))**0.5


def AAD(resid_vec):
    """
    Calculate average absolute deviation

    resid_vec (np.array(n) or list of float): residuals
    return (float): AAD
    """
    return np.mean(np.abs(np.array(resid_vec)))


def const_param_wrappers(fun, params0, const_param_names, model_param_names):
    """
    Handle the constant & variable parameters in the optimization problem by wrapping the residual function.

    fun (function): residual function of whole model parameters
    params0 (list of float): initial estimate of whole model parameters (ordered)
    const_param_names (list of str): names of parameters to be kept constant during optimization
    model_param_names (list of str): names of all model parameters

    return (tuple): initial variable params, wrapped resid fun, fun to reconstruct whole params
    """
    # partition model parameters per indices: those that are to be kept constant, those that will be optimized (variable)
    const_param_idxs = [model_param_names.index(name) for name in const_param_names]
    const_params, var_params0 = pick_vector(params0, const_param_idxs)

    # construct whole params with newly acquired variable params
    merge_params = lambda new_params: overlay_vectors(const_params, const_param_idxs, new_params)

    # wrapped residual as function of variable model parameters, which are merged with const parameters
    wrapped_fun = lambda var_params, *args: fun(overlay_vectors(const_params, const_param_idxs, var_params), *args)

    # expose everything required to start and finish the problem
    return var_params0, wrapped_fun, merge_params
