import { TableView } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { FC, useState } from 'react';

import { useFitVLEResultsDialog } from '../../../actions/FitVLE/useFitVLEResultsDialog.tsx';
import { SystemIdentifier } from '../../../adapters/api/types/common.ts';
import { PersistedFit } from '../../../adapters/api/types/fitTypes.ts';
import { SpecifyFitDialog } from '../SpecifyFitDialog.tsx';

type AlterFittedModelButtonProps = SystemIdentifier & { fit: PersistedFit };

export const AlterFittedModelButton: FC<AlterFittedModelButtonProps> = ({ compound1, compound2, fit }) => {
    const [open, setOpen] = useState(false);
    const { perform, result } = useFitVLEResultsDialog();

    return (
        <>
            <Tooltip title="Alter the model fitting">
                <IconButton children={<TableView />} onClick={() => setOpen(true)} />
            </Tooltip>
            {open && (
                <SpecifyFitDialog
                    open={open}
                    handleClose={() => setOpen(false)}
                    compound1={compound1}
                    compound2={compound2}
                    currentFit={fit}
                    performFitVLE={perform}
                />
            )}
            {result}
        </>
    );
};
