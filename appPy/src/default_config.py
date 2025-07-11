# IMMUTABLE CONFIG
consts_dict = {
    ## CALCULATIONS
    'T_boil_tol': 1e-3,  # [K] tolerance for optimization of boiling point

    ## CONSTANTS
    'C2K': 273.15,  # [K]
    'TF0': -5 / 9 * 459.67,  # 0 K in [°F]
    'R': 8.31446,  # [J/K/mol]
    'atm': 101.325,  # [kPa]

    ## APP BEHAVIOR
    'cli_fg_ok': 'green',
    'cli_fg_err': 'bright_red',
    'cli_fg_warn': 'yellow',
    'x_points_smooth_plot': 101  # how many x points shall be tabulated when function is plotted
}

# MUTABLE CONFIG
# these are the default values, which are initialized in user data folder at first run
# don't forget to update configTypes.tsx
default_config_dict = {
    ## CALCULATIONS – arbitrary tolerances & criteria
    # [%] gamma tolerance for simple gamma test
    'gamma_abs_tol': 1.5,
    # [%] when extrapolating vapor pressure, allow temp to be out bounds by = this * (vapor pressure fun temp interval)
    'T_bounds_rel_tol': 10,
    # [%] in Redlich-Kister test, data is inconsistent if D > this
    'rk_D_criterion': 10,  # for isobaric data
    'rk_D_criterion_isotherm': 2,  # for isothermal data
    # [%] in Herington test, data is inconsistent if |D-J| > this
    'herington_DJ_criterion': 10,
    # relative tolerance for integration error in Redlich-Kister
    'rk_quad_rel_tol': 1e-4,
    # [%] in Fredenslund test, when average residuals are above this threshold, data is declared inconsistent
    'fredenslund_criterion': 1,
    # default maximum order of Legendre polynomials in Fredenslund test
    'default_legendre_order': 4,
    # van Ness marking interval, where consistency index = floor(RMS/interval)
    'van_Ness_marking_interval': 0.025,
    # van Ness maximum mark, which means test failure
    'van_Ness_max_mark': 10,

    ## UI
    'notify_app_update': True,

    # whether to render chart elements
    'chart_title': True,
    'chart_legend': True,
    'chart_grid': False,
    'chart_tick_marks': True,
    # chart default aspect ratio
    'chart_aspect_ratio': 1.0,
    # whether to expand all nodes in tree view
    'UI_expandAll': True,

    # Units of Measurement
    'UoM_p': 'kPa',
    'UoM_T': '°C',
}
