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

export type FitAnalysisResponse = AnalysisResult & {
    is_optimized: boolean;
    tabulated_datasets: PlottedDataset[];

    nparams0: NamedParams;
    nparams: NamedParams;

    RMS0: number;
    RMS_final: number | null;
    AAD0: number;
    AAD_final: number | null;
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
};

export type VaporFitResponse = AnalysisResult & {
    is_p_optimized: boolean;
    is_T_p_optimized: boolean;
    odr_messages: string[];
    T_min: number;
    T_max: number;
    plot_p?: string;
    plot_T_p?: string;

    nparams0: NamedParams;
    nparams_p?: NamedParams;
    nparams_T_p?: NamedParams;

    RMS0: number;
    RMS_p: number | null;
    RMS_T_p: number | null;
    AAD0: number;
    AAD_p: number | null;
    AAD_T_p: number | null;
};
