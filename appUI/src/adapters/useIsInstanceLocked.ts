// see main.ts, preload.ts, where the variable is transmitted via IPC event
import { useEffect, useState } from 'react';

export const useIsInstanceLocked = () => {
    const [isInstanceLocked, setIsInstanceLocked] = useState(false);

    useEffect(() => {
        window.electron.getInstanceLock().then(setIsInstanceLocked);
    }, []);

    return isInstanceLocked;
};
