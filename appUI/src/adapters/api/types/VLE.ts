import { AnalysisResult, VLEDatasetIdentifier } from './common.ts';

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

/* POST ANALYSIS */
export type VLEAnalysisRequest = VLEDatasetIdentifier;

export type VLEAnalysisResponse = AnalysisResult &
    DatasetTable & {
        x_2: number[];
        y_2: number[];
        gamma_1: number[];
        gamma_2: number[];
    };

/* POST UPSERT */
export type UpsertVLEDatasetRequest = VLEDatasetIdentifier & {
    p: number[];
    T: number[];
    x_1: number[];
    y_1: number[];
};

/* DELETE */
export type DeleteVLERequest = {
    compound1: string;
    compound2: string;
    dataset?: string; // delete entire system if not specified
};
