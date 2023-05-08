import numpy as np
from matplotlib import pyplot as plt
from scipy.interpolate import UnivariateSpline
from src.utils.get_antoine import get_antoine_and_warn
from src.TD.analyze_VLE import analyze_VLE


# perform simple point to point slope test
def slope_test(table, compound1, compound2):
    res = analyze_VLE(table, compound1, compound2)

    plt.plot(res.x_1, res.gamma_1)
    plt.plot(res.x_1, res.gamma_2)
    plt.show()

    # dy2 = UnivariateSpline(x, y, k=4, s=0).derivative()(x)
