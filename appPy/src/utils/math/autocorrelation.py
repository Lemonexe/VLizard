import numpy as np


def durbin_watson(resids):
    """
    Calculate the Durbin-Watson statistic on a vector (assumed to be optimization residuals) to evaluate autocorrelation.
    Result should be 2 → no autocorr. Less than 2 → positive autocorr. Greater than 2 → negative autocorr.

    resids(np.array or list): vector to be evaluated
    """
    resids = np.array(resids)
    diff = np.diff(resids)
    return np.sum(diff**2) / np.sum(resids**2)


def von_neumann(resids):
    """
    Calculate the von Neumann statistic on a vector (assumed to be optimization residuals) to evaluate autocorrelation.
    Result should be 2 → no autocorr. Less than 2 → positive autocorr. Greater than 2 → negative autocorr.

    resids(np.array or list): vector to be evaluated
    """
    resids = np.array(resids)
    diff = np.diff(resids)
    return np.sum(diff**2) / np.sum((resids - np.mean(resids))**2)
