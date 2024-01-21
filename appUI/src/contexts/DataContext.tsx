import { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react';
import { useGetVaporModelDefs, useGetVaporModels } from '../adapters/api/useVapor.ts';
import { useGetPersistedFits } from '../adapters/api/useFit.ts';
import { useGetVLESystems } from '../adapters/api/useVLE.ts';
import { DatasetTable, GetVLESystemsResponse, VLESystem } from '../adapters/api/types/VLE.ts';
import { GetVaporModelDefsResponse, GetVaporModelsResponse, VaporModel } from '../adapters/api/types/vapor.ts';
import { GetPersistedFitsResponse } from '../adapters/api/types/fit.ts';
import { findCompound, findDataset, findSystem, getCompoundNames, getSystemNames } from '../adapters/dataQueries.ts';

export type DataContextType = {
    compoundNames: string[];
    vaporData?: GetVaporModelsResponse;
    systemNames: string[];
    VLEData?: GetVLESystemsResponse;
    fitData?: GetPersistedFitsResponse;
    vaporDefs?: GetVaporModelDefsResponse;
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
    // todo fitDefs

    const providerValue = useMemo(() => {
        return {
            compoundNames: getCompoundNames(vaporData),
            vaporData,
            systemNames: getSystemNames(VLEData),
            VLEData,
            fitData,
            vaporDefs,
            findCompound: (comp: string) => findCompound(comp, vaporData),
            findSystem: (comp1: string, comp2: string) => findSystem(comp1, comp2, VLEData),
            findDataset: (comp1: string, comp2: string, dataset: string) => findDataset(comp1, comp2, dataset, VLEData),
        };
    }, [vaporData, VLEData, fitData, vaporDefs]);

    return <DataContext.Provider value={providerValue}>{children}</DataContext.Provider>;
};
