import numpy as np
from .Vapor_Model import Vapor_Model

antoine_fun = lambda T, A, B, C: np.exp(A + B / (T+C))
"""
Calculate vapor pressure using simple Antoine equation.

T (float): temperature [K]
A (float): parameter [ln kPa]
B (float): parameter [ln kPa·K]
C (float): parameter [K]
return (float): vapor pressure [kPa]
"""

antoine_model = Vapor_Model(
    name='Antoine',
    fun=antoine_fun,
    n_params=3,
    params0=np.array([14.5, -3500, -100]),
    param_names=['A', 'B', 'C'],
)
