from src.utils.json import open_json

# ------------------
# OVERRIDABLE CONFIG
# ------------------

data = open_json('src/default_config.json')

# CALCULATIONS: arbitrary tolerances & criteria

# gamma tolerance for simple gamma test
gamma_abs_tol = data['gamma_abs_tol']
# when extrapolating Antoine, allow temperature to be out bounds by = this * (Antoine temp interval)
antoine_bounds_rel_tol = data['antoine_bounds_rel_tol']
# [%] in Redlich-Kister test, data is inconsistent if D > this
rk_D_criterion = data['rk_D_criterion']
# [%] in Herington test, data is inconsistent if |D-J| > this
herington_DJ_criterion = data['herington_DJ_criterion']
# relative tolerance for integration error in Redlich-Kister
rk_quad_rel_tol = data['rk_quad_rel_tol']
# [%] in Fredenslund test, when average residuals are above this threshold, data is declared inconsistent
fredenslund_criterion = data['fredenslund_criterion']

# ----------------
# IMMUTABLE CONFIG
# ----------------

# CALCULATIONS
T_boil_tol = 1e-3  # [K] tolerance for optimization of boiling point

# CONSTANTS
R = 8.31446  # [J/K/mol]

# UI
cli_fg_ok = 'green'
cli_fg_err = 'bright_red'
cli_fg_warn = 'yellow'
x_points_smooth_plot = 100  # how many x points shall be tabulated when function is plotted
