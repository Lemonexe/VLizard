import { FC, PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@mui/material';
import { MUITheme } from './adapters/MUITheme.tsx';
import { NotificationProvider } from './adapters/NotificationContext.tsx';
import { DefaultLayout } from './components/DefaultLayout.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

const queryClient = new QueryClient();

export const AppProviders: FC<PropsWithChildren> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={MUITheme}>
            <NotificationProvider>
                <DefaultLayout>
                    <ErrorBoundary>{children}</ErrorBoundary>
                </DefaultLayout>
            </NotificationProvider>
        </ThemeProvider>
    </QueryClientProvider>
);
