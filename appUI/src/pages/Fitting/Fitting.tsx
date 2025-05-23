import { KeyboardDoubleArrowDown, KeyboardDoubleArrowUp } from '@mui/icons-material';
import { Button } from '@mui/material';
import { FC, useState } from 'react';

import { DefaultLayout } from '../../components/DefaultLayout.tsx';
import { HeaderStack } from '../../components/Mui/HeaderStack.tsx';
import { useConfig } from '../../contexts/ConfigContext.tsx';
import { useData } from '../../contexts/DataContext.tsx';

import { FittedModelsTable } from './FittedModelsTable.tsx';

export const Fitting: FC = () => {
    const { UI_expandAll } = useConfig();
    const [expandAll, setExpandAll] = useState(UI_expandAll);

    const { VLEData } = useData();
    const showCollapseButton = VLEData && VLEData.length > 0;

    return (
        <DefaultLayout>
            <HeaderStack>
                <h2>Fitting</h2>
                {showCollapseButton && (
                    <Button
                        variant="text"
                        startIcon={expandAll ? <KeyboardDoubleArrowUp /> : <KeyboardDoubleArrowDown />}
                        onClick={() => setExpandAll((prev) => !prev)}
                        children={expandAll ? 'Collapse all' : 'Expand all'}
                    />
                )}
            </HeaderStack>
            <FittedModelsTable expandAll={expandAll} />
        </DefaultLayout>
    );
};
