import { AnalysisResult, CompoundIdentifier, NamedParams, VaporModelIdentifier } from './common.ts';

/* GET instance of model for compound */
export type VaporModel = VaporModelIdentifier & {
    params: NamedParams;
    T_min: number;
    T_max: number;
};

export type GetVaporModelsResponse = VaporModel[];

/* GET general definitions of model types */
export type VaporModelDef = {
    name: string;
    params0: number[];
    param_names: string[];
};

export type GetVaporModelDefsResponse = VaporModelDef[];

/* POST ANALYSIS */
export type VaporAnalysisRequest = CompoundIdentifier;

export type VaporAnalysisResponse = AnalysisResult &
    VaporModelIdentifier & {
        T_min: number;
        T_max: number;
        T_boil: number;
        plot: string;
    };

/* PUT */
export type UpdateVaporModelRequest = VaporModelIdentifier & {
    T_min: number;
    T_max: number;
    params: number[];
};

/* DELETE */
export type DeleteVaporModelRequest = VaporModelIdentifier;
