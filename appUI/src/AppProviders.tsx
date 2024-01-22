import { FC, PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { MUITheme } from './contexts/MUITheme.tsx';
import { NotificationProvider } from './contexts/NotificationContext.tsx';
import { DataContextProvider } from './contexts/DataContext.tsx';
import { IsItUpWatcher } from './components/IsItUpWatcher.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

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
                        <DataContextProvider>{children}</DataContextProvider>
                    </ErrorBoundary>
                </IsItUpWatcher>
            </NotificationProvider>
        </ThemeProvider>
    </QueryClientProvider>
);
