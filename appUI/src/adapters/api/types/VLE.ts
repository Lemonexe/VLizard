import { AnalysisResult, VLEDatasetIdentifier } from './common.ts';

/* GET */
export type DatasetTable = {
    name: string;
    x_1: number[];
    y_1: number[];
    T: number[];
    p: number[];
};

export type VLESystem = { system: string; datasets: string[] };

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
export type DeleteVLEDatasetRequest = VLEDatasetIdentifier;