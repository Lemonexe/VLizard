import { ChangeEvent, FC, useCallback, useState } from 'react';
import { TextField } from '@mui/material';
import { DefaultLayout } from '../../components/DefaultLayout.tsx';
import { HeaderStack } from '../../components/Mui/HeaderStack.tsx';
import { CompoundsTable } from './CompoundsTable.tsx';
import { AddCompoundButton } from './buttons/AddCompoundButton.tsx';

export const Compounds: FC = () => {
    const [filter, setFilter] = useState('');
    const handleChangeFilter = useCallback((e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value), []);

    return (
        <DefaultLayout>
            <HeaderStack>
                <h2>Pure compounds data</h2>
                <TextField label="Filter" value={filter} onChange={handleChangeFilter} size="small" />
                <AddCompoundButton />
            </HeaderStack>
            <CompoundsTable filter={filter.trim()} />
        </DefaultLayout>
    );
};
