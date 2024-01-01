import { AnalysisResult } from './common.ts';

/* GET */
export type VaporModel = {
    model_name: string;
    param_names: string[];
    params: number[];
    T_min: number;
    T_max: number;
};

export type GetVaporModelsResponse = Record<string, VaporModel>; // key = compound

/* POST ANALYSIS */
export type VaporAnalysisRequest = { compound: string };

export type VaporAnalysisResponse = AnalysisResult & {
    compound: string;
    T_min: number;
    T_max: number;
    T_boil: number;
    T_tab: number[];
    p_tab: number[];
};

/* PUT */
export type UpdateVaporModelRequest = {
    compound: string;
    model_name: string;
    T_min: number;
    T_max: number;
    params: number[];
};

/* DELETE */
export type DeleteVaporModelRequest = {
    compound: string;
    model_name: string;
};
