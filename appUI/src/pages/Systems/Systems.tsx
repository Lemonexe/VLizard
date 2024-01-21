import { FC } from 'react';
import { DefaultLayout } from '../../components/DefaultLayout.tsx';
import { HeaderStack } from '../../components/Mui/HeaderStack.tsx';
import { SystemsTable } from './SystemsTable.tsx';
import { AddSystemButton } from './buttons/AddSystemButton.tsx';

export const Systems: FC = () => (
    <DefaultLayout>
        <HeaderStack>
            <h2>Binary systems data</h2>
            <AddSystemButton />
        </HeaderStack>
        <SystemsTable />
    </DefaultLayout>
);
