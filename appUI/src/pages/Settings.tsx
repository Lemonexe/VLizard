import { FC } from 'react';
import { DefaultLayout } from '../components/DefaultLayout.tsx';
import { HeaderStack } from '../components/Mui/HeaderStack.tsx';

export const Settings: FC = () => (
    <DefaultLayout>
        <HeaderStack>
            <h2>Settings</h2>
        </HeaderStack>
        Settings
    </DefaultLayout>
);
