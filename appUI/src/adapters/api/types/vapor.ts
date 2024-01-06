import { AnalysisResult, NamedParams } from './common.ts';

/* GET */
export type VaporModel = {
    compound: string;
    model_name: string;
    params: NamedParams;
    T_min: number;
    T_max: number;
};

export type GetVaporModelsResponse = VaporModel[];

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
