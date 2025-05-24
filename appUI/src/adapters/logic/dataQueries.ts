import { DatasetTable, GetVLEModelDefsResponse, GetVLESystemsResponse, VLESystem } from '../api/types/VLETypes.ts';
import { GetPersistedFitsResponse, PersistedFit } from '../api/types/fitTypes.ts';
import { GetVaporModelsResponse, VaporModel } from '../api/types/vaporTypes.ts';

export const listCompounds = (vaporData?: GetVaporModelsResponse): string[] =>
    vaporData?.map(({ compound }) => compound) ?? [];

export const listSystems = (VLEData?: GetVLESystemsResponse): string[] =>
    VLEData?.map(({ system_name }) => system_name) ?? [];

export const findCompound = (comp: string, vaporData?: GetVaporModelsResponse): VaporModel | null =>
    vaporData?.find(({ compound }) => comp === compound) ?? null;

export const findSystem = (comp1: string, comp2: string, VLEData?: GetVLESystemsResponse): VLESystem | null =>
    VLEData?.find(({ system_name }) => system_name === `${comp1}-${comp2}`) ?? null;

export const findDataset = (
    comp1: string,
    comp2: string,
    dataset: string,
    VLEData?: GetVLESystemsResponse,
): DatasetTable | null => {
    const system = findSystem(comp1, comp2, VLEData);
    return system?.datasets.find(({ name }) => name === dataset) ?? null;
};

export const listFitsForSystem = (comp1: string, comp2: string, fitData?: GetPersistedFitsResponse): PersistedFit[] => {
    const systemName = `${comp1}-${comp2}`;
    return fitData?.find((fit) => fit.system_name === systemName)?.fits ?? [];
};

export const findVLEModelByName = (model_name: string, VLEModelDefs?: GetVLEModelDefsResponse) =>
    VLEModelDefs?.find(({ name }) => name === model_name) ?? null;
