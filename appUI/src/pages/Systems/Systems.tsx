import { FC, useState } from 'react';
import { Button } from '@mui/material';
import { PostAdd } from '@mui/icons-material';
import { DefaultLayout } from '../../components/DefaultLayout.tsx';
import { HeaderStack } from '../../components/Mui/HeaderStack.tsx';
import { SystemsTable } from './SystemsTable.tsx';
import { UpsertDatasetDialog } from './UpsertDatasetDialog.tsx';

export const Systems: FC = () => {
    const [open, setOpen] = useState(false);
    return (
        <DefaultLayout>
            <HeaderStack>
                <h2>Binary systems data</h2>
                <Button variant="contained" startIcon={<PostAdd />} onClick={() => setOpen(true)}>
                    Add new
                </Button>
            </HeaderStack>
            <SystemsTable />
            <UpsertDatasetDialog open={open} handleClose={() => setOpen(false)} />
        </DefaultLayout>
    );
};
