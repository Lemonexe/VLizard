import { FC, useState } from 'react';
import { Button } from '@mui/material';
import { PostAdd } from '@mui/icons-material';
import { UpsertCompoundDialog } from './UpsertCompoundDialog.tsx';

export const AddCompoundButton: FC = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="contained" startIcon={<PostAdd />} onClick={() => setOpen(true)}>
                Add new
            </Button>
            {open && <UpsertCompoundDialog open={open} handleClose={() => setOpen(false)} />}
        </>
    );
};
