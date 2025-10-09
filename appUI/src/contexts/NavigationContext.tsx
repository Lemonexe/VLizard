import { Dispatch, FC, PropsWithChildren, createContext, useCallback, useContext, useState } from 'react';

/*
 Tiny recreation of react-router, this is all I need :-)
*/

export type Route = 'home' | 'compounds' | 'systems' | 'fitting' | 'settings' | 'about';

const initialRoute: Route = 'home';

export type NavigationContextType = {
    currentRoute: Route;
    navigate: Dispatch<Route>;
};

export const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [currentRoute, setCurrentRoute] = useState<Route>(initialRoute);

    const navigate = useCallback((newRoute: Route) => {
        setCurrentRoute(newRoute);
    }, []);

    return <NavigationContext.Provider value={{ currentRoute, navigate }}>{children}</NavigationContext.Provider>;
};

export const useNavigation = () => {
    const routeContext = useContext(NavigationContext);
    if (!routeContext) throw new Error(`${useNavigation.name} must be used within a ${NavigationContextProvider.name}`);
    return routeContext;
};
