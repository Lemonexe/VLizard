import { DatasetTable, GetVLESystemsResponse, VLESystem } from './api/types/VLE.ts';
import { GetVaporModelsResponse, VaporModel } from './api/types/vapor.ts';

export const getCompoundNames = (vaporData?: GetVaporModelsResponse): string[] =>
    vaporData?.map(({ compound }) => compound) ?? [];

export const getSystemNames = (VLEData?: GetVLESystemsResponse): string[] =>
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
