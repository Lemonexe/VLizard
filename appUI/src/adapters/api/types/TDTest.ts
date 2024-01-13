import { AnalysisResult, DatasetIdentifier } from './common.ts';

export type ConclusiveTestResult = AnalysisResult & { is_consistent: boolean };

export type TestRequest = DatasetIdentifier;

export type GammaTestResponse = ConclusiveTestResult & {
    err_1: number;
    err_2: number;
    gamma_abs_tol: number;
    x_tab: number[];
    gamma_tab_1: number[];
    gamma_tab_2: number[];
};

export type SlopeTestResponse = AnalysisResult & {
    P2P_res: number[];
    x_1: number[];
    d_ln_gamma_1: number[];
    d_ln_gamma_2: number[];
};

export type RKTestResponse = ConclusiveTestResult & {
    D: number;
    criterion: number;
    x_1: number[];
    curve: number[];
    x_tab: number[];
    curve_tab: number[];
};

export type HeringtonTestResponse = ConclusiveTestResult & {
    D: number;
    DJ: number;
    J: number;
    criterion: number;
};

export type FredenslundTestRequest = DatasetIdentifier & {
    legendre_order: 3 | 4 | 5;
};

export type FredenslundTestResponse = ConclusiveTestResult & {
    criterion: number;
    legendre_order: number;
    x_tab: number[];
    g_E_tab: number[];
    x_1: number[];
    g_E_exp: number[];
    p_res: number[];
    y_1_res: number[];
    y_2_res: number[];
    p_res_avg: number;
    y_1_res_avg: number;
    y_2_res_avg: number;
};
