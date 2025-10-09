import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, PropsWithChildren } from 'react';

import { UpdateAvailableModalWatcher } from './components/AppUpdate/UpdateAvailableModalWatcher.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { IsItUpWatcher } from './components/IsItUpWatcher.tsx';
import { ConfigContextProvider } from './contexts/ConfigContext.tsx';
import { DataContextProvider } from './contexts/DataContext.tsx';
import { MUITheme } from './contexts/MUITheme.tsx';
import { NavigationContextProvider } from './contexts/NavigationContext.tsx';
import { NotificationProvider } from './contexts/NotificationContext.tsx';

const staleTime = Infinity;
const gcTime = 5 * 60 * 1000;
const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime, gcTime, retry: 0, networkMode: 'always' },
        mutations: { networkMode: 'always' },
    },
});

export const AppProviders: FC<PropsWithChildren> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={MUITheme}>
            <NotificationProvider>
                <IsItUpWatcher>
                    <ErrorBoundary>
                        <ConfigContextProvider>
                            <DataContextProvider>
                                <NavigationContextProvider>
                                    <UpdateAvailableModalWatcher />
                                    {children}
                                </NavigationContextProvider>
                            </DataContextProvider>
                        </ConfigContextProvider>
                    </ErrorBoundary>
                </IsItUpWatcher>
            </NotificationProvider>
        </ThemeProvider>
    </QueryClientProvider>
);
