import { Dispatch, FC } from 'react';
import { Box, Stack } from '@mui/material';
import { SetSpreadsheetData, SpreadsheetData } from '../../adapters/spreadsheet.ts';
import { AddRowsButton } from './AddRowsButton.tsx';
import { TrimButton } from './TrimButton.tsx';
import { RestoreButton } from './RestoreButton.tsx';

type SpreadsheetControlsProps = {
    setData: SetSpreadsheetData;
    touched: boolean;
    setTouched: Dispatch<boolean>;
    initialData?: SpreadsheetData;
};

export const SpreadsheetControls: FC<SpreadsheetControlsProps> = ({ setData, touched, setTouched, initialData }) => (
    <Stack direction="column" gap={1}>
        <Box>
            <AddRowsButton setData={setData} />
        </Box>
        <Box>
            <TrimButton setData={setData} />
        </Box>
        <Box>
            {initialData && touched && (
                <RestoreButton initialData={initialData} setData={setData} setTouched={setTouched} />
            )}
        </Box>
    </Stack>
);
