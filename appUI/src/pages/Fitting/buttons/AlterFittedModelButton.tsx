import { FC, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { TableView } from '@mui/icons-material';
import { SystemIdentifier } from '../../../adapters/api/types/common.ts';
import { PersistedFit } from '../../../adapters/api/types/fitTypes.ts';
import { SpecifyFitDialog } from '../SpecifyFitDialog.tsx';

type AlterFittedModelButtonProps = SystemIdentifier & { fit: PersistedFit };

export const AlterFittedModelButton: FC<AlterFittedModelButtonProps> = ({ compound1, compound2, fit }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Tooltip title="Alter the model fitting">
                <IconButton children={<TableView />} onClick={() => setOpen(true)} />
            </Tooltip>
            <SpecifyFitDialog
                open={open}
                handleClose={() => setOpen(false)}
                compound1={compound1}
                compound2={compound2}
                currentFit={fit}
            />
        </>
    );
};
