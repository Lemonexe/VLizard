import { FC, PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@mui/material';
import { MUITheme } from './adapters/MUITheme.tsx';
import { NotificationProvider } from './adapters/NotificationContext.tsx';
import { IsItUpWatcher } from './components/IsItUpWatcher.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { DefaultLayout } from './components/DefaultLayout.tsx';

const queryClient = new QueryClient();

export const AppProviders: FC<PropsWithChildren> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={MUITheme}>
            <NotificationProvider>
                <IsItUpWatcher>
                    <ErrorBoundary>
                        <DefaultLayout>{children}</DefaultLayout>
                    </ErrorBoundary>
                </IsItUpWatcher>
            </NotificationProvider>
        </ThemeProvider>
    </QueryClientProvider>
);
