import { PostAdd } from '@mui/icons-material';
import { Button } from '@mui/material';
import { FC, useState } from 'react';

import { UpsertDatasetDialog } from '../UpsertDatasetDialog.tsx';

export const AddSystemButton: FC = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="contained" startIcon={<PostAdd />} onClick={() => setOpen(true)}>
                Add new
            </Button>
            {open && <UpsertDatasetDialog open={open} handleClose={() => setOpen(false)} />}
        </>
    );
};
