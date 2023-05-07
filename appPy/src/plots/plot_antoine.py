import numpy as np
from matplotlib import pyplot as plt
from src.TD.get_antoine import get_antoine


# prepare printable plot of Antoine per compound
# then plt.show() or plt.savefig('foo.png') must be called
def plot_antoine(compound):
    (antoine_fun, T_min, T_max) = get_antoine(compound)
    T = np.linspace(T_min, T_max, num=100)
    p = antoine_fun(T)

    plt.plot(T, p, '-k')
    plt.title(f'Vapor pressure for {compound}')
    plt.xlabel('T [K]')
    plt.ylabel('p [kPa]')
