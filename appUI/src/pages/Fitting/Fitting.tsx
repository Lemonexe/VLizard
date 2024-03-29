import { FC, useState } from 'react';
import { Button, Stack } from '@mui/material';
import { KeyboardDoubleArrowDown, KeyboardDoubleArrowUp } from '@mui/icons-material';
import { useConfig } from '../../contexts/ConfigContext.tsx';
import { DefaultLayout } from '../../components/DefaultLayout.tsx';
import { HeaderStack } from '../../components/Mui/HeaderStack.tsx';
import { FittedModelsTable } from './FittedModelsTable.tsx';

export const Fitting: FC = () => {
    const cfg = useConfig();
    const [expandAll, setExpandAll] = useState(cfg.UI_expandAll);
    return (
        <DefaultLayout>
            <HeaderStack>
                <h2>Fitting</h2>
                <Stack direction="row" gap={1}>
                    <Button
                        variant="text"
                        startIcon={expandAll ? <KeyboardDoubleArrowUp /> : <KeyboardDoubleArrowDown />}
                        onClick={() => setExpandAll((prev) => !prev)}
                        children={expandAll ? 'Collapse all' : 'Expand all'}
                    />
                </Stack>
            </HeaderStack>
            <FittedModelsTable expandAll={expandAll} />
        </DefaultLayout>
    );
};
