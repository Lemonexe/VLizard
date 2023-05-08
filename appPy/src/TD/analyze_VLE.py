from src.utils.get_antoine import get_antoine_and_warn


def analyze_VLE(table, compound1, compound2):
    res = {'warnings': []}

    (res['p'], res['T'], res['x_1'], res['y_1']) = table.T
    (antoine_fun_1, warnings) = get_antoine_and_warn(compound1, np.min(T), np.max(T))
    res['warnings'].extend(warnings)
    (antoine_fun_2, warnings) = get_antoine_and_warn(compound2, np.min(T), np.max(T))
    res['warnings'].extend(warnings)

    res['ps_1'] = antoine_fun_1(T)
    res['ps_2'] = antoine_fun_2(T)

    res['gamma_1'] = y_1 * p / x_1 / ps_1
    res['gamma_2'] = (1-y_1) * p / (1-x_1) / ps_2

    return res
