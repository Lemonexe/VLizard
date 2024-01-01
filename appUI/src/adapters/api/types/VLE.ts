import { AnalysisResult, VLEDatasetIdentifier } from './common.ts';

/* GET */
export type DatasetTable = {
    x_1: number[];
    y_1: number[];
    T: number[];
    p: number[];
};

export type VLESystem = Record<string, DatasetTable>; // key = dataset name

export type GetVLESystemsResponse = Record<string, VLESystem>; // key = compound1-compound2

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
