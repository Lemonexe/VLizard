import { AnalysisResult, DatasetIdentifier } from './common.ts';

export type ConclusiveTestResult = AnalysisResult & { is_consistent: boolean };

export type TestRequest = DatasetIdentifier;

export type GammaTestResponse = ConclusiveTestResult & { plot: string };

export type SlopeTestResponse = AnalysisResult & { plot: string };

export type RKTestResponse = ConclusiveTestResult & {
    D: number;
    criterion: number;
    plot: string;
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
    p_res_avg: number;
    y_1_res_avg: number;
    y_2_res_avg: number;
    plot_g_E: string;
    plot_p_res: string;
    plot_y_1_res: string;
};
