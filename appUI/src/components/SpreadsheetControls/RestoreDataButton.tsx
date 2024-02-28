import { FC, useState } from 'react';
import { Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

type RestoreDataButtonProps = {
    handleRestoreData: () => void;
};

export const RestoreDataButton: FC<RestoreDataButtonProps> = ({ handleRestoreData }) => {
    const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

    return showRestoreConfirm ? (
        <span>
            <Button onClick={handleRestoreData} variant="text">
                Confirm
            </Button>
            <Button onClick={() => setShowRestoreConfirm(false)} variant="text">
                Cancel
            </Button>
        </span>
    ) : (
        <Button onClick={() => setShowRestoreConfirm(true)} variant="outlined" startIcon={<Refresh />}>
            Restore data
        </Button>
    );
};
