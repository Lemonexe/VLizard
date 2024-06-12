import { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react';
import { useGetVaporModelDefs, useGetVaporModels } from '../adapters/api/useVapor.ts';
import { useGetPersistedFits } from '../adapters/api/useFit.ts';
import { useGetVLEModelDefs, useGetVLESystems } from '../adapters/api/useVLE.ts';
import {
    DatasetTable,
    GetVLEModelDefsResponse,
    GetVLESystemsResponse,
    VLESystem,
} from '../adapters/api/types/VLETypes.ts';
import { GetVaporModelDefsResponse, GetVaporModelsResponse, VaporModel } from '../adapters/api/types/vaporTypes.ts';
import { GetPersistedFitsResponse } from '../adapters/api/types/fitTypes.ts';
import { findCompound, findDataset, findSystem, listCompounds, listSystems } from '../adapters/logic/dataQueries.ts';

export type DataContextType = {
    compoundNames: string[];
    vaporData?: GetVaporModelsResponse;
    systemNames: string[];
    VLEData?: GetVLESystemsResponse;
    fitData?: GetPersistedFitsResponse;
    vaporDefs?: GetVaporModelDefsResponse;
    VLEModelDefs?: GetVLEModelDefsResponse;
    // utility functions
    findCompound: (comp: string) => VaporModel | null;
    findSystem: (comp1: string, comp2: string) => VLESystem | null;
    findDataset: (comp1: string, comp2: string, dataset: string) => DatasetTable | null;
};

export const DataContext = createContext<DataContextType | null>(null);

export const useData = (): DataContextType => {
    const currentCtx = useContext(DataContext);
    if (!currentCtx) throw new Error('useData must be used within a DataContextProvider');
    return currentCtx;
};

export const DataContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const { data: vaporData } = useGetVaporModels();
    const { data: VLEData } = useGetVLESystems();
    const { data: fitData } = useGetPersistedFits();
    const { data: vaporDefs } = useGetVaporModelDefs();
    const { data: VLEModelDefs } = useGetVLEModelDefs();

    const providerValue = useMemo(() => {
        return {
            compoundNames: listCompounds(vaporData),
            vaporData,
            systemNames: listSystems(VLEData),
            VLEData,
            fitData,
            vaporDefs,
            VLEModelDefs,
            findCompound: (comp: string) => findCompound(comp, vaporData),
            findSystem: (comp1: string, comp2: string) => findSystem(comp1, comp2, VLEData),
            findDataset: (comp1: string, comp2: string, dataset: string) => findDataset(comp1, comp2, dataset, VLEData),
        };
    }, [vaporData, VLEData, fitData, vaporDefs]);

    return <DataContext.Provider value={providerValue}>{children}</DataContext.Provider>;
};
