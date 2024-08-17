import { AnalysisResult, DatasetIdentifier, NamedParams, SystemIdentifier } from './common.ts';

/* GET */
export type DatasetTable = {
    name: string;
    x_1: number[];
    y_1: number[];
    T: number[];
    p: number[];
};

export type VLESystem = { system_name: string; datasets: DatasetTable[] };

export type GetVLESystemsResponse = VLESystem[];

/* GET general definitions of model types */
export type VLEModelDef = {
    name: string;
    display_name: string;
    nparams0: NamedParams;
    param_labels: Record<string, string>;
    is_gamma_T_fun: boolean;
    always_const_param_names?: string[];
};

export type GetVLEModelDefsResponse = VLEModelDef[];

/* POST ANALYSIS */
export type VLEAnalysisRequest = DatasetIdentifier;

export type VLEAnalysisResponse = AnalysisResult &
    DatasetTable & {
        gamma_1: number[];
        gamma_2: number[];
        ps_1: number[];
        ps_2: number[];
        plot_xy: string;
        plot_Txy: string;
        plot_gamma: string;
        p_avg: number;
        T_avg: number;
    };

/* POST UPSERT */
export type UpsertVLEDatasetRequest = DatasetIdentifier & {
    p: number[];
    T: number[];
    x_1: number[];
    y_1: number[];
};

/* DELETE */
export type DeleteVLERequest = SystemIdentifier & {
    dataset?: string; // delete entire system if not specified
};
