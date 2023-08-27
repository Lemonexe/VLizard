from src.utils.io.json import open_json, save_json

# -------------------
# OVERRIDABLE CONFIG
# -------------------

# APP
port_number = 4663

# CALCULATIONS: arbitrary tolerances & criteria

# gamma tolerance for simple gamma test
gamma_abs_tol = 3e-2
# when extrapolating vapor pressure, allow temp to be out bounds by: this * (vapor pressure fun temp interval)
T_bounds_rel_tol = 0.10
# [%] in Redlich-Kister test, data is inconsistent if D > this
rk_D_criterion = 10
# [%] in Herington test, data is inconsistent if |D-J| > this
herington_DJ_criterion = 10
# relative tolerance for integration error in Redlich-Kister
rk_quad_rel_tol = 1e-4
# [%] in Fredenslund test, when average residuals are above this threshold, data is declared inconsistent
fredenslund_criterion = 1
# order of Legendre polynomials in Fredenslund test
default_legendre_order = 4

# -----------------
# IMMUTABLE CONFIG
# -----------------

# CALCULATIONS
T_boil_tol = 1e-3  # [K] tolerance for optimization of boiling point

# CONSTANTS
C2K = 273.15  # [K]
R = 8.31446  # [J/K/mol]
atm = 101.325  # [kPa]

# APP
cli_fg_ok = 'green'
cli_fg_err = 'bright_red'
cli_fg_warn = 'yellow'
x_points_smooth_plot = 101  # how many x points shall be tabulated when function is plotted

# ------------
# JSON CONFIG
# ------------

# load config.json file with users' config data and assign to the constants above
data = open_json('data/config.json')
if data:
    gamma_abs_tol = data.get('gamma_abs_tol', gamma_abs_tol) or gamma_abs_tol
    T_bounds_rel_tol = data.get('T_bounds_rel_tol', T_bounds_rel_tol) or T_bounds_rel_tol
    rk_D_criterion = data.get('rk_D_criterion', rk_D_criterion) or rk_D_criterion
    herington_DJ_criterion = data.get('herington_DJ_criterion', herington_DJ_criterion) or herington_DJ_criterion
    rk_quad_rel_tol = data.get('rk_quad_rel_tol', rk_quad_rel_tol) or rk_quad_rel_tol
    fredenslund_criterion = data.get('fredenslund_criterion', fredenslund_criterion) or fredenslund_criterion
    port_number = data.get('port_number', port_number) or port_number


def generate_config():
    """
    Generate initial config.json file from default config.
    Currently unused, will be used when data is stored in user's home directory.
    """
    blank_config_data = {
        'gamma_abs_tol': gamma_abs_tol,
        'T_bounds_rel_tol': T_bounds_rel_tol,
        'rk_D_criterion': rk_D_criterion,
        'herington_DJ_criterion': herington_DJ_criterion,
        'rk_quad_rel_tol': rk_quad_rel_tol,
        'fredenslund_criterion': fredenslund_criterion,
        'port_number': port_number
    }
    save_json(blank_config_data, 'data/config.json', pretty=True)
