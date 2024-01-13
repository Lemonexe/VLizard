import { AnalysisResult, DatasetIdentifier, SystemIdentifier } from './common.ts';

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
export type VLEAnalysisRequest = DatasetIdentifier;

export type VLEAnalysisResponse = AnalysisResult &
    DatasetTable & {
        x_2: number[];
        y_2: number[];
        gamma_1: number[];
        gamma_2: number[];
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
