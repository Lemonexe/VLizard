import { useEffect, useState } from 'react';
import { useAvailableAppUpdate } from '../../adapters/api/useAvailableAppUpdate.ts';
import { UpdateAvailableModal } from './UpdateAvailableModal.tsx';

export const UpdateAvailableModalWatcher = () => {
    const [open, setOpen] = useState(false);
    const [wasOpened, setWasOpened] = useState(false);
    const handleClose = () => setOpen(false);

    const availableAppUpdate = useAvailableAppUpdate();

    useEffect(() => {
        if (!wasOpened && availableAppUpdate !== null) {
            setOpen(true);
            setWasOpened(true);
        }
    }, [wasOpened, availableAppUpdate]);

    return <UpdateAvailableModal open={open} handleClose={handleClose} isNotification />;
};
