import { FC, useState } from 'react';
import { Button } from '@mui/material';
import { KeyboardDoubleArrowDown, KeyboardDoubleArrowUp } from '@mui/icons-material';
import { useConfig } from '../../contexts/ConfigContext.tsx';
import { useData } from '../../contexts/DataContext.tsx';
import { DefaultLayout } from '../../components/DefaultLayout.tsx';
import { HeaderStack } from '../../components/Mui/HeaderStack.tsx';
import { FittedModelsTable } from './FittedModelsTable.tsx';

export const Fitting: FC = () => {
    const cfg = useConfig();
    const [expandAll, setExpandAll] = useState(cfg.UI_expandAll);

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
