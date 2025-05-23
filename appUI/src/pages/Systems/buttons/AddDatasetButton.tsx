import { PostAdd } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { FC, useState } from 'react';

import { SystemIdentifier } from '../../../adapters/api/types/common.ts';
import { UpsertDatasetDialog } from '../UpsertDatasetDialog.tsx';

export const AddDatasetButton: FC<SystemIdentifier> = ({ compound1, compound2 }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Tooltip title="Add a new dataset">
                <IconButton children={<PostAdd />} onClick={() => setOpen(true)} />
            </Tooltip>
            {open && (
                <UpsertDatasetDialog
                    open={open}
                    handleClose={() => setOpen(false)}
                    origCompound1={compound1}
                    origCompound2={compound2}
                />
            )}
        </>
    );
};
