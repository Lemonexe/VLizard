import { FC, useState } from 'react';
import { Button, Stack } from '@mui/material';
import { KeyboardDoubleArrowDown, KeyboardDoubleArrowUp } from '@mui/icons-material';
import { useConfig } from '../../contexts/ConfigContext.tsx';
import { DefaultLayout } from '../../components/DefaultLayout.tsx';
import { HeaderStack } from '../../components/Mui/HeaderStack.tsx';
import { SystemsTable } from './SystemsTable.tsx';
import { AddSystemButton } from './buttons/AddSystemButton.tsx';

export const Systems: FC = () => {
    const cfg = useConfig();
    const [expandAll, setExpandAll] = useState(cfg.UI_expandAll);
    return (
        <DefaultLayout>
            <HeaderStack>
                <h2>Binary systems data</h2>
                <Stack direction="row" gap={1}>
                    <Button
                        variant="text"
                        startIcon={expandAll ? <KeyboardDoubleArrowUp /> : <KeyboardDoubleArrowDown />}
                        onClick={() => setExpandAll((prev) => !prev)}
                        children={expandAll ? 'Collapse all' : 'Expand all'}
                    />
                    <AddSystemButton />
                </Stack>
            </HeaderStack>
            <SystemsTable expandAll={expandAll} />
        </DefaultLayout>
    );
};
