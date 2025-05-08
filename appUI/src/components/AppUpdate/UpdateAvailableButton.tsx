import { useState } from 'react';
import { useAvailableAppUpdate } from '../../adapters/api/useAvailableAppUpdate.ts';
import { UpdateAvailableModal } from './UpdateAvailableModal.tsx';
import { Button } from '@mui/material';
import { Search } from '@mui/icons-material';

export const UpdateAvailableButton = () => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleButtonClick = () => setOpen(true);

    const availableAppUpdate = useAvailableAppUpdate();
    if (availableAppUpdate === null) return null;

    return (
        <>
            <Button startIcon={<Search />} onClick={handleButtonClick} variant="contained">
                Update available
            </Button>
            <UpdateAvailableModal open={open} handleClose={handleClose} />
        </>
    );
};
