import numpy as np
from .Vapor_Model import Vapor_Model

# simple Antoine equation for vapor pressure
antoine_fun = lambda T, A, B, C: np.exp(A + B / (T+C))

antoine_model = Vapor_Model(
    name='Antoine',
    fun=antoine_fun,
    n_params=3,
    params0=np.array([14.5, -3500, -100]),
    param_names=['A', 'B', 'C'],
)
