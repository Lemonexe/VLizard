import { FC, PropsWithChildren } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { DefaultLayout } from './components/DefaultLayout.tsx';
import { Home } from './pages/Home.tsx';
import { Data } from './pages/Data.tsx';
import { Analysis } from './pages/Analysis.tsx';
import { Fitting } from './pages/Fitting.tsx';
import { Settings } from './pages/Settings.tsx';
import { About } from './pages/About.tsx';

const MUITheme = createTheme({
    typography: {
        fontFamily: ['Open Sans', 'sans-serif'].join(','),
        h1: { fontSize: '2rem', fontWeight: 700 },
        h2: { fontSize: '1.5rem', fontWeight: 700 },
        h3: { fontSize: '1.25rem', fontWeight: 700 },
    },
});

const AppProviders: FC<PropsWithChildren> = ({ children }) => (
    <ThemeProvider theme={MUITheme}>
        <DefaultLayout>{children}</DefaultLayout>
    </ThemeProvider>
);

export const App: FC = () => (
    <AppProviders>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="data" element={<Data />} />
                <Route path="analysis" element={<Analysis />} />
                <Route path="fitting" element={<Fitting />} />
                <Route path="settings" element={<Settings />} />
                <Route path="about" element={<About />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    </AppProviders>
);
