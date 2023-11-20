import { FC } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home.tsx';
import { Data } from './pages/Data.tsx';
import { Analysis } from './pages/Analysis.tsx';
import { Fitting } from './pages/Fitting.tsx';
import { Settings } from './pages/Settings.tsx';
import { About } from './pages/About.tsx';
import { AppProviders } from './AppProviders.tsx';

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
