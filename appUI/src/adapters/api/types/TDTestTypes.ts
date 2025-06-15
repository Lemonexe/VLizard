import { AnalysisResult, DatasetIdentifier } from './common.ts';

export type ConclusiveTestResult = AnalysisResult & { is_consistent: boolean };

export type TestRequest = DatasetIdentifier;

export type GammaTestResponse = ConclusiveTestResult & {
    err_1: number;
    err_2: number;
    delta_gamma_1: number;
    delta_gamma_2: number;
    plot: string;
};

export type SlopeTestResponse = AnalysisResult & {
    x_1: number[];
    d_ln_gamma_1: number[];
    d_ln_gamma_2: number[];
    P2P_res: number[];
    P2P_res_avg: number;
    plot_residuals: string;
    plot_derivations: string;
};

export type RKTestResponse = ConclusiveTestResult & {
    D: number;
    curve_dif: number;
    curve_sum: number;
    plot: string;
    x_1: number[];
    curve: number[];
};

export type HeringtonTestResponse = ConclusiveTestResult & {
    D: number;
    DJ: number;
    J: number;
    isothermal_error: boolean;
};

export type FredenslundTestRequest = DatasetIdentifier & {
    legendre_order: number; // 3 | 4 | 5 actually, but TS doesn't really make life easier with number unions
};

export type FredenslundTestResponse = ConclusiveTestResult & {
    legendre_order: number;
    p_res_avg: number;
    y_1_res_avg: number;
    y_2_res_avg: number;
    x_1: number[];
    p_res: number[];
    y_1_res: number[];
    y_2_res: number[];
    plot_g_E: string;
    plot_p_res: string;
    plot_y_1_res: string;
};

export type VanNessTestRequest = DatasetIdentifier & { model_name: string };

export type VanNessTestResponse = ConclusiveTestResult & {
    is_warning: boolean; // when consistency_index is between <5, 10)
    consistency_index: number;
    RMS: number;
    x_1: number[];
    residuals: number[];
    plot: string;
};
