import { Dispatch, FC, useState } from 'react';
import { Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { SetSpreadsheetData, SpreadsheetData } from '../../adapters/logic/spreadsheet.ts';

type RestoreButtonProps = {
    initialData: SpreadsheetData;
    setData: SetSpreadsheetData;
    setTouched: Dispatch<boolean>;
};

export const RestoreButton: FC<RestoreButtonProps> = ({ initialData, setData, setTouched }) => {
    const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

    const handleRestore = () => {
        setShowRestoreConfirm(false);
        setData(initialData);
        setTouched(false);
    };

    return showRestoreConfirm ? (
        <span>
            <Button onClick={handleRestore} variant="text">
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
