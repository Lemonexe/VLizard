import { AnalysisResult, MultipleDatasetsIdentifier, NamedParams, SystemIdentifier } from './common.ts';

/* GET saved optimized models for systems */
export type PersistedFit = {
    model_name: string;
    input: {
        datasets: string[];
        params0: NamedParams;
        const_param_names: string[];
    };
    results: {
        RMS_final: number;
        AAD_final: number;
        result_params: NamedParams;
    };
};

export type PersistedFitsForSystem = {
    system_name: string;
    fits: PersistedFit[];
};

export type GetPersistedFitsResponse = PersistedFitsForSystem[];

/* GET general definitions of model types */
export type VLEModelDef = {
    name: string;
    params0: number[];
    param_names: string[];
    is_gamma_T_fun: boolean;
};

export type GetVLEModelDefsResponse = VLEModelDef[];

/* POST ANALYSIS */
export type FitAnalysisRequest = MultipleDatasetsIdentifier & {
    model_name: string;
    params0?: number[];
    const_param_names?: string[];
    skip_optimization?: boolean;
};

export type TabulatedDataset = AnalysisResult & {
    name: string;
    p_mean: number;
    xy_plot: string;
    Txy_plot: string;
    gamma_plot: string;
};

export type FitAnalysisResponse = AnalysisResult & {
    is_optimized: boolean;
    RMS_init: number;
    RMS_final: number | null;
    AAD_init: number;
    AAD_final: number | null;
    result_params: NamedParams;
    tabulated_datasets: TabulatedDataset[];
};

/* DELETE */
export type DeleteFitRequest = SystemIdentifier & {
    model_name: string;
};
