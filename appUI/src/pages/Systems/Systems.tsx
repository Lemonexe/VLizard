import { FC } from 'react';
import { Button } from '@mui/material';
import { PostAdd } from '@mui/icons-material';
import { DefaultLayout } from '../../components/DefaultLayout.tsx';
import { HeaderStack } from '../../components/Mui/HeaderStack.tsx';
import { SystemsTable } from './SystemsTable.tsx';

export const Systems: FC = () => (
    <DefaultLayout>
        <HeaderStack>
            <h2>Binary systems data</h2>
            <Button variant="contained" startIcon={<PostAdd />}>
                Add new
            </Button>
        </HeaderStack>
        <SystemsTable />
    </DefaultLayout>
);
