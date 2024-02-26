import { FC, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { TableView } from '@mui/icons-material';
import { SystemIdentifier } from '../../../adapters/api/types/common.ts';
import { PersistedFit } from '../../../adapters/api/types/fitTypes.ts';

type AlterFittedModelButtonProps = SystemIdentifier & { fit: PersistedFit };

export const AlterFittedModelButton: FC<AlterFittedModelButtonProps> = ({ compound1, compound2, fit }) => {
    const [open, setOpen] = useState(false);
    console.log(open, compound1, compound2, fit.model_name);
    return (
        <>
            <Tooltip title="Alter the model fitting">
                <IconButton children={<TableView />} onClick={() => setOpen(true)} />
            </Tooltip>
        </>
    );
};
