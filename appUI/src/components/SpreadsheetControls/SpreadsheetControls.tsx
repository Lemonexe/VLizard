import { FC } from 'react';
import { Box, Stack } from '@mui/material';
import { SetSpreadsheetData } from '../../adapters/logic/spreadsheet.ts';
import { AddRowsButton } from './AddRowsButton.tsx';
import { TrimButton } from './TrimButton.tsx';
import { RestoreDataButton } from './RestoreDataButton.tsx';

type SpreadsheetControlsProps = {
    setData: SetSpreadsheetData;
    showRestoreData: boolean;
    handleRestoreData: () => void;
};

export const SpreadsheetControls: FC<SpreadsheetControlsProps> = ({ setData, showRestoreData, handleRestoreData }) => (
    <Stack direction="column" gap={1}>
        <Box>
            <AddRowsButton setData={setData} />
        </Box>
        <Box>
            <TrimButton setData={setData} />
        </Box>
        <Box>{showRestoreData && <RestoreDataButton handleRestoreData={handleRestoreData} />}</Box>
    </Stack>
);
