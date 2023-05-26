cli_fg_ok = 'green'
cli_fg_err = 'bright_red'
cli_fg_warn = 'yellow'
x_points_smooth_plot = 100  # how many x points shall be tabelated when function is plotted
antoine_bounds_rel_tol = 0.10  # when extrapolating Antoine, allow temperature to be out bounds by = this * (Antoine temp interval)
rk_D_criterion = 10  # [%] in Redlich-Kister test, data is inconsistent if D > this
herington_DJ_criterion = 10  # [%] in Herington test, data is inconsistent if |D-J| > this
rk_quad_rel_tol = 1e-4  # relative tolerance for integration error in Redlich-Kister
fredenslund_criterion = 1  # [%] in Fredenslund test, when average residuals are above this threshold, data is declared inconsistent
