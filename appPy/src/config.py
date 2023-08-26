from src.utils.io.json import open_json

# ------------------
# OVERRIDABLE CONFIG
# ------------------

data = open_json('src/default_config.json')

# CALCULATIONS: arbitrary tolerances & criteria

# gamma tolerance for simple gamma test
gamma_abs_tol = data['gamma_abs_tol']
# when extrapolating vapor pressure, allow temp to be out bounds by: this * (vapor pressure fun temp interval)
T_bounds_rel_tol = data['T_bounds_rel_tol']
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
C2K = 273.15  # [K]
R = 8.31446  # [J/K/mol]
atm = 101.325  # [kPa]

# APP
port_number = 4663
cli_fg_ok = 'green'
cli_fg_err = 'bright_red'
cli_fg_warn = 'yellow'
x_points_smooth_plot = 101  # how many x points shall be tabulated when function is plotted
