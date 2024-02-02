import { FC, useState } from 'react';
import { Button, Stack } from '@mui/material';
import { KeyboardDoubleArrowDown, KeyboardDoubleArrowUp } from '@mui/icons-material';
import { DefaultLayout } from '../../components/DefaultLayout.tsx';
import { HeaderStack } from '../../components/Mui/HeaderStack.tsx';
import { SystemsTable } from './SystemsTable.tsx';
import { AddSystemButton } from './buttons/AddSystemButton.tsx';

export const Systems: FC = () => {
    const [expandAll, setExpandAll] = useState(true);
    return (
        <DefaultLayout>
            <HeaderStack>
                <h2>Binary systems data</h2>
                <Stack direction="row" gap={1}>
                    <Button
                        variant="outlined"
                        startIcon={expandAll ? <KeyboardDoubleArrowUp /> : <KeyboardDoubleArrowDown />}
                        onClick={() => setExpandAll((prev) => !prev)}
                    >
                        {expandAll ? 'Collapse all' : 'Expand all'}
                    </Button>
                    <AddSystemButton />
                </Stack>
            </HeaderStack>
            <SystemsTable expandAll={expandAll} />
        </DefaultLayout>
    );
};
