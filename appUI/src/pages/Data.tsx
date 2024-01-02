import { FC, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { DefaultLayout } from '../components/DefaultLayout.tsx';

export const Data: FC = () => {
    const [selectedTab, setSelectedTab] = useState('compounds');

    return (
        <DefaultLayout>
            <h2>Data</h2>

            <Tabs value={selectedTab} onChange={(_e, val) => setSelectedTab(val)}>
                <Tab label="Compounds" value="compounds" />
                <Tab label="Binary systems" value="VLESystems" />
            </Tabs>

            {selectedTab === 'compounds' && <h3>Compounds</h3>}
            {selectedTab === 'VLESystems' && <h3>Binary systems</h3>}
        </DefaultLayout>
    );
};
