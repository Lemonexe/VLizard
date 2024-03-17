import numpy as np


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
