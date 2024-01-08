import { FC, PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@mui/material';
import { MUITheme } from './adapters/MUITheme.tsx';
import { NotificationProvider } from './adapters/NotificationContext.tsx';
import { IsItUpWatcher } from './components/IsItUpWatcher.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { DataContextProvider } from './contexts/DataContext.tsx';

const staleTime = Infinity;
const cacheTime = 5 * 60 * 1000;
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime, cacheTime, retry: 0 } } });

export const AppProviders: FC<PropsWithChildren> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={MUITheme}>
            <NotificationProvider>
                <IsItUpWatcher>
                    <ErrorBoundary>
                        <DataContextProvider>{children}</DataContextProvider>
                    </ErrorBoundary>
                </IsItUpWatcher>
            </NotificationProvider>
        </ThemeProvider>
    </QueryClientProvider>
);
