import numpy as np
# from scipy.interpolate import UnivariateSpline
from matplotlib import pyplot as plt
from src.TD.analyze_VLE import VLE
from src.utils.math.diff_noneq import diffs_noneq


# todo rewrite as class
# perform simple point to point slope test
def slope_test(table, compound1, compound2):
    res = VLE(table, compound1, compound2)

    res.plot_gamma()

    # spl_1 = UnivariateSpline(res.x_1, res.gamma_1, k=3, s=0)
    # spl_2 = UnivariateSpline(res.x_1, res.gamma_2, k=3, s=0)
    # plt.plot(res.x_1, spl_1(res.x_1), '--b')
    # plt.plot(res.x_1, spl_2(res.x_1), '--r')
    plt.show()

    d_ln_gamma = diffs_noneq(res.x_1, np.array([res.gamma_1, res.gamma_2]), res.x_1)

    # d_ln_gamma_1 = spl_1.derivative()(res.x_1)
    # d_ln_gamma_2 = spl_2.derivative()(res.x_1)
    d_ln_gamma_1 = d_ln_gamma[0, :]
    d_ln_gamma_2 = d_ln_gamma[1, :]
    P2P_resid = res.x_1 * d_ln_gamma_1 + res.x_2 * d_ln_gamma_2
    plt.plot(res.x_1, d_ln_gamma_1, '^b')
    plt.plot(res.x_1, d_ln_gamma_2, '^r')
    plt.plot(res.x_1, P2P_resid, 'sk')
    plt.axhline(y=0, color='k', linestyle=':')
    plt.show()
