import { FC, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { QueryStats } from '@mui/icons-material';
import { DatasetIdentifier } from '../../../adapters/api/types/common.ts';
import { ChooseTDTestDialog } from '../ChooseTDTestDialog.tsx';

export const PerformTDTestButton: FC<DatasetIdentifier> = (props) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Tooltip title="Perform analysis">
                <IconButton children={<QueryStats />} onClick={() => setOpen(true)} />
            </Tooltip>
            {open && <ChooseTDTestDialog open={open} handleClose={() => setOpen(false)} {...props} />}
        </>
    );
};
