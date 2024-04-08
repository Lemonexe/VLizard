import { AnalysisResult, MultipleDatasetsIdentifier, NamedParams, SystemIdentifier } from './common.ts';

/* GET saved optimized models for systems */
export type PersistedFit = {
    model_name: string;
    input: {
        datasets: string[];
        nparams0: NamedParams;
        const_param_names: string[];
    };
    results: {
        RMS_final: number;
        AAD_final: number;
        nparams: NamedParams;
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
    nparams0: NamedParams;
    is_gamma_T_fun: boolean;
};

export type GetVLEModelDefsResponse = VLEModelDef[];

/* POST ANALYSIS */
export type FitAnalysisRequest = MultipleDatasetsIdentifier & {
    model_name: string;
    nparams0?: NamedParams;
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
    nparams0: NamedParams;
    nparams: NamedParams;
    tabulated_datasets: TabulatedDataset[];
};

/* DELETE */
export type DeleteFitRequest = SystemIdentifier & {
    model_name: string;
};
