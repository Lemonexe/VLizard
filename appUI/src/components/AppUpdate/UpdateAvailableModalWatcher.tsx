import { useEffect, useState } from 'react';

import { useAvailableAppUpdate } from '../../adapters/api/useAvailableAppUpdate.ts';
import { useConfig } from '../../contexts/ConfigContext.tsx';

import { UpdateAvailableModal } from './UpdateAvailableModal.tsx';

export const UpdateAvailableModalWatcher = () => {
    const [open, setOpen] = useState(false);
    const [wasOpened, setWasOpened] = useState(false);
    const handleClose = () => setOpen(false);

    const availableAppUpdate = useAvailableAppUpdate();
    const { notify_app_update } = useConfig();

    useEffect(() => {
        if (notify_app_update && !wasOpened && availableAppUpdate !== null) {
            setOpen(true);
            setWasOpened(true);
        }
    }, [wasOpened, availableAppUpdate, notify_app_update]);

    return <UpdateAvailableModal open={open} handleClose={handleClose} isNotification />;
};
