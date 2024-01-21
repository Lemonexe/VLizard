import { FC } from 'react';
import { DefaultLayout } from '../../components/DefaultLayout.tsx';
import { HeaderStack } from '../../components/Mui/HeaderStack.tsx';
import { CompoundsTable } from './CompoundsTable.tsx';
import { AddCompoundButton } from './AddCompoundButton.tsx';

export const Compounds: FC = () => (
    <DefaultLayout>
        <HeaderStack>
            <h2>Pure compounds data</h2>
            <AddCompoundButton />
        </HeaderStack>
        <CompoundsTable />
    </DefaultLayout>
);
