import { FC, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { UpsertCompoundDialog } from '../UpsertCompoundDialog.tsx';
import { CompoundIdentifier } from '../../../adapters/api/types/common.ts';

export const EditCompoundButton: FC<CompoundIdentifier> = ({ compound }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Tooltip title="Change or edit vapor pressure model">
                <IconButton children={<Edit />} onClick={() => setOpen(true)} />
            </Tooltip>
            {open && <UpsertCompoundDialog open={open} handleClose={() => setOpen(false)} origCompound={compound} />}
        </>
    );
};
