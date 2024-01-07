import { FC } from 'react';
import { Button } from '@mui/material';
import { PostAdd } from '@mui/icons-material';
import { DefaultLayout } from '../../components/DefaultLayout.tsx';
import { HeaderStack } from '../../components/Mui/HeaderStack.tsx';
import { CompoundsTable } from './CompoundsTable.tsx';

export const Compounds: FC = () => (
    <DefaultLayout>
        <HeaderStack>
            <h2>Pure compounds data</h2>
            <Button variant="contained" startIcon={<PostAdd />}>
                Add new
            </Button>
        </HeaderStack>
        <CompoundsTable />
    </DefaultLayout>
);
