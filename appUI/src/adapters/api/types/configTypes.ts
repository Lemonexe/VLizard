export type Config = {
    // Calculation settings
    gamma_abs_tol: number;
    T_bounds_rel_tol: number;
    rk_D_criterion: number;
    herington_DJ_criterion: number;
    rk_quad_rel_tol: number;
    fredenslund_criterion: number;
    default_legendre_order: number;
    van_Ness_marking_interval: number;
    van_Ness_max_mark: number;

    // UI settings
    chart_title: boolean;
    chart_legend: boolean;
    chart_grid: boolean;
    chart_aspect_ratio: boolean;
    UI_expandAll: boolean;
    UoM_p: string;
    UoM_T: string;
    notify_app_update: boolean;
};

export type UpdateConfigRequest = Partial<Config>;
