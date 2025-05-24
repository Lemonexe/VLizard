import { FC, PropsWithChildren, createContext, useContext } from 'react';

import { Config } from '../adapters/api/types/configTypes.ts';
import { useGetConfig } from '../adapters/api/useConfigApi.ts';
import { CenteredLoader } from '../components/Loader.tsx';

export const ConfigContext = createContext<Config | null>(null);

export const useConfig = (): Config => {
    const currentCtx = useContext(ConfigContext);
    if (!currentCtx) throw new Error('useConfig must be used within a ConfigContextProvider');
    return currentCtx;
};

export const ConfigContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const { data } = useGetConfig();
    if (!data) return <CenteredLoader subject="user data" />;
    return <ConfigContext.Provider value={data}>{children}</ConfigContext.Provider>;
};
