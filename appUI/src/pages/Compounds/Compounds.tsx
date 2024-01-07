import { FC } from 'react';
import { Button, Stack } from '@mui/material';
import { PostAdd } from '@mui/icons-material';
import { DefaultLayout } from '../../components/DefaultLayout.tsx';

export const Compounds: FC = () => {
    return (
        <DefaultLayout>
            <Stack direction="row" justifyContent="space-between">
                <h2>Pure compounds data</h2>

                <Button variant="contained" startIcon={<PostAdd />}>
                    Add new
                </Button>
            </Stack>
        </DefaultLayout>
    );
};