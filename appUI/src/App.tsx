import { FC } from 'react';

import { AppProviders } from './AppProviders.tsx';
import { useNavigation } from './contexts/NavigationContext.tsx';
import { About } from './pages/About.tsx';
import { Compounds } from './pages/Compounds/Compounds.tsx';
import { Fitting } from './pages/Fitting/Fitting.tsx';
import { Home } from './pages/Home.tsx';
import { Settings } from './pages/Settings.tsx';
import { Systems } from './pages/Systems/Systems.tsx';

const Routes: FC = () => {
    const { currentRoute } = useNavigation();

    switch (currentRoute) {
        case 'home':
            return <Home />;
        case 'compounds':
            return <Compounds />;
        case 'systems':
            return <Systems />;
        case 'fitting':
            return <Fitting />;
        case 'settings':
            return <Settings />;
        case 'about':
            return <About />;
        default:
            return <Home />;
    }
};

export const App: FC = () => (
    <AppProviders>
        <Routes />
    </AppProviders>
);
