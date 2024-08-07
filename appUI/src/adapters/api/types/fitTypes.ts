import {
    AnalysisResult,
    CompoundIdentifier,
    MultipleDatasetsIdentifier,
    NamedParams,
    SystemIdentifier,
} from './common.ts';

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

/* POST VLE FIT & TABULATE */
export type FitAnalysisRequest = MultipleDatasetsIdentifier & {
    model_name: string;
    nparams0?: NamedParams;
    const_param_names?: string[];
    skip_optimization?: boolean;
};

export type PlottedDataset = AnalysisResult & {
    name: string;
    p: number;
    xy_plot: string;
    Txy_plot: string;
    gamma_plot: string;
};

type FitMetrics = AnalysisResult & {
    is_optimized: boolean;
    RMS_init: number;
    RMS_final: number | null;
    AAD_init: number;
    AAD_final: number | null;
};

export type FitAnalysisResponse = FitMetrics & {
    nparams0: NamedParams;
    nparams: NamedParams;
    tabulated_datasets: PlottedDataset[];
};

export type FitTabulateRequest = SystemIdentifier & { model_name: string; p: number };

type DatasetTabulation = { T: number[]; x_1: number[]; y_1: number[]; gamma_1: number[]; gamma_2: number[] };
export type TabulatedDataset = PlottedDataset & DatasetTabulation;

/* DELETE VLE FIT */
export type DeleteFitRequest = SystemIdentifier & {
    model_name: string;
};

/* POST VAPOR FIT */
export type VaporFitRequest = CompoundIdentifier & {
    model_name: string;
    p_data: number[];
    T_data: number[];
    nparams0?: NamedParams;
    skip_T_p_optimization?: boolean;
};

export type VaporFitResponse = FitMetrics & {
    is_T_p_optimized: boolean;
    RMS_inter: number | null;
    AAD_inter: number | null;
    nparams0: NamedParams;
    nparams_inter: NamedParams;
    nparams: NamedParams;
    T_min: number;
    T_max: number;
    plot_p: string;
    plot_T_p?: string;
};
