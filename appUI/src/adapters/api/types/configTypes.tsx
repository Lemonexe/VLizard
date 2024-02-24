export type Config = {
    T_bounds_rel_tol: number;
    default_legendre_order: number;
    fredenslund_criterion: number;
    gamma_abs_tol: number;
    herington_DJ_criterion: number;
    rk_D_criterion: number;
    rk_quad_rel_tol: number;
};

export type UpdateConfigRequest = Partial<Config>;
