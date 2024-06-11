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
    param_labels=['A / ln kPa', 'B / ln kPa·K', 'C / K'],
)

antoine_ext_fun = lambda T, A, B, C, D, E, F, G: np.exp(A + B / (T+C) + D*T + E * np.log(T) + F * T**G)
"""
Calculate vapor pressure using extended Antoine equation.

T (float): temperature [K]
A (float): parameter [ln kPa]
B (float): parameter [ln kPa·K]
C (float): parameter [K]
D (float): parameter [1/K]
E (float): parameter [ln kPa / ln K]
F (float): parameter [ln kPa · K^-G]
G (float): parameter [1]
return (float): vapor pressure [kPa]
"""

antoine_ext_model = Vapor_Model(
    name='AntoineExt',
    display_name='Antoine Extended',
    fun=antoine_ext_fun,
    n_params=7,
    params0=np.array([14.5, -3500, -100, 0, 0, 0, 0]),
    param_names=['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    param_labels=['A / ln kPa', 'B / ln kPa·K', 'C / K', 'D', 'E', 'F', 'G'],
)
