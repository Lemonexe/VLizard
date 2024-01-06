import { FC, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { DefaultLayout } from '../components/DefaultLayout.tsx';
import { Compounds } from './Compounds/Compounds.tsx';
import { Systems } from './Systems/Systems.tsx';

export const Data: FC = () => {
    const [selectedTab, setSelectedTab] = useState('compounds');

    return (
        <DefaultLayout>
            <h2>VLE Data</h2>
            {/* TODO */}
            <p>??? Maybe don't use tabs but separate top menu pages..</p>
            <Tabs value={selectedTab} onChange={(_e, val) => setSelectedTab(val)}>
                <Tab label="Compounds" value="compounds" />
                <Tab label="Binary systems" value="VLESystems" />
            </Tabs>
            {selectedTab === 'compounds' && <Compounds />}
            {selectedTab === 'VLESystems' && <Systems />}
        </DefaultLayout>
    );
};
