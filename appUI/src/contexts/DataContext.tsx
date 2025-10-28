import { FC, PropsWithChildren, createContext, useContext, useMemo } from 'react';

import {
    DatasetTable,
    GetVLEModelDefsResponse,
    GetVLESystemsResponse,
    VLEModelDef,
    VLESystem,
} from '../adapters/api/types/VLETypes.ts';
import { GetPersistedFitsResponse, PersistedFit } from '../adapters/api/types/fitTypes.ts';
import { GetVaporModelDefsResponse, GetVaporModelsResponse, VaporModel } from '../adapters/api/types/vaporTypes.ts';
import { useGetPersistedFits } from '../adapters/api/useFit.ts';
import { useGetVLEModelDefs, useGetVLESystems } from '../adapters/api/useVLE.ts';
import { useGetVaporModelDefs, useGetVaporModels } from '../adapters/api/useVapor.ts';
import {
    findCompound,
    findDataset,
    findSystem,
    findVLEModelByName,
    listCompounds,
    listFitsForSystem,
    listSystems,
} from '../adapters/logic/dataQueries.ts';

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
    listFitsForSystem: (comp1: string, comp2: string) => PersistedFit[];
    findVLEModelByName: (model_name: string) => VLEModelDef | null;
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

    const providerValue = useMemo<DataContextType>(() => {
        return {
            compoundNames: listCompounds(vaporData),
            vaporData,
            systemNames: listSystems(VLEData),
            VLEData,
            fitData,
            vaporDefs,
            VLEModelDefs,
            findCompound: (comp) => findCompound(comp, vaporData),
            findSystem: (comp1, comp2) => findSystem(comp1, comp2, VLEData),
            findDataset: (comp1, comp2, dataset) => findDataset(comp1, comp2, dataset, VLEData),
            listFitsForSystem: (comp1, comp2) => listFitsForSystem(comp1, comp2, fitData),
            findVLEModelByName: (model_name) => findVLEModelByName(model_name, VLEModelDefs),
        };
    }, [vaporData, VLEData, fitData, vaporDefs, VLEModelDefs]);

    return <DataContext.Provider value={providerValue}>{children}</DataContext.Provider>;
};
