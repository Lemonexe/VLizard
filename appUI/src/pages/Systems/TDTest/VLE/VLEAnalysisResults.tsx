import { FC, useMemo } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { Stack } from '@mui/material';
import { fromRows, makeReadOnly } from '../../../../adapters/logic/spreadsheet.ts';
import { VLEAnalysisResultsProps } from './VLEAnalysisResultsProps.ts';
import { XYChart } from './XYChart.tsx';
import { TXYChart } from './TXYChart.tsx';
import { GammaChart } from './GammaChart.tsx';

export const VLEAnalysisResults: FC<VLEAnalysisResultsProps> = ({ label, data }) => {
    const columnLabels = ['p', 'T', 'x1', 'y1', 'gamma1', 'gamma2'];

    const spreadsheetData = useMemo(
        () => makeReadOnly(fromRows([data.p, data.T, data.x_1, data.y_1, data.gamma_1, data.gamma_2])),
        [data],
    );

    return (
        <Stack direction="column" gap={4} pt={1}>
            <Spreadsheet data={spreadsheetData} columnLabels={columnLabels} />
            <XYChart label={label} data={data} />
            <TXYChart label={label} data={data} />
            <GammaChart label={label} data={data} />
        </Stack>
    );
};
