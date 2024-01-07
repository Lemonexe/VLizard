import { FC, PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { useGetVaporModels } from '../adapters/api/useVapor.ts';
import { useGetPersistedFits } from '../adapters/api/useFit.ts';
import { useGetVLESystems } from '../adapters/api/useVLE.ts';
import { GetVLESystemsResponse } from '../adapters/api/types/VLE.ts';
import { GetVaporModelsResponse } from '../adapters/api/types/vapor.ts';
import { GetPersistedFitsResponse } from '../adapters/api/types/fit.ts';

export type DataContextType = {
    compoundNames: string[];
    vaporData?: GetVaporModelsResponse;
    systemNames: string[];
    VLEData?: GetVLESystemsResponse;
    fitData?: GetPersistedFitsResponse;
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

    const providerValue = useMemo(() => {
        return {
            compoundNames: vaporData?.map(({ compound }) => compound) ?? [],
            vaporData,
            systemNames: VLEData?.map(({ system_name }) => system_name) ?? [],
            VLEData,
            fitData,
        };
    }, [vaporData, VLEData, fitData]);

    return <DataContext.Provider value={providerValue}>{children}</DataContext.Provider>;
};
