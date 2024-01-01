import { AnalysisResult, NamedParams } from './common.ts';

/* GET */
export type PersistedFit = {
    input: {
        datasets: string[];
        params0: NamedParams;
        const_param_names: string[];
    };
    results: {
        resid_final: number;
        result_params: NamedParams;
    };
};

export type PersistedFitsForSystem = Record<string, PersistedFit>;

export type GetPersistedFitsResponse = Record<string, PersistedFitsForSystem>;

/* POST ANALYSIS */
export type FitAnalysisRequest = {
    compound1: string;
    compound2: string;
    model_name: string;
    datasets: string[];
    params0?: string[];
    const_param_names?: string[];
    skip_optimization?: boolean;
};

export type TabulatedDataset = AnalysisResult & {
    p_mean: number;
    x_1: number[];
    y_1: number[];
    y_2: number[];
    T: number[];
    gamma_1: number[];
    gamma_2: number[];
};

export type FitAnalysisResponse = AnalysisResult & {
    is_optimized: boolean;
    resid_init: number;
    resid_final: number;
    result_params: NamedParams;
    tabulated_datasets: TabulatedDataset[];
};

/* DELETE */
export type DeleteFitRequest = {
    compound1: string;
    compound2: string;
    model_name: string;
};
