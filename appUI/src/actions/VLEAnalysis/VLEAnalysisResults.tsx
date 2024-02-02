import { FC, useMemo } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { Box, Stack } from '@mui/material';
import { fromRows, makeReadOnly } from '../../adapters/logic/spreadsheet.ts';
import { VLEAnalysisResultsProps } from './VLEAnalysisResultsProps.ts';
import { RawHtmlRenderer } from '../../components/RawHtmlRenderer.tsx';
import { DownloadChartButton } from '../../components/DownloadChartButton.tsx';

export const VLEAnalysisResults: FC<VLEAnalysisResultsProps> = ({ label, data }) => {
    const columnLabels = ['p', 'T', 'x1', 'y1', 'gamma1', 'gamma2'];

    const spreadsheetData = useMemo(
        () => makeReadOnly(fromRows([data.p, data.T, data.x_1, data.y_1, data.gamma_1, data.gamma_2])),
        [data],
    );

    return (
        <Stack direction="column" gap={4} pt={1}>
            <Spreadsheet data={spreadsheetData} columnLabels={columnLabels} />
            <Box>
                <RawHtmlRenderer rawHtml={data.plot_xy} />
                <DownloadChartButton svgContent={data.plot_xy} fileName={`xy chart ${label}`} />
            </Box>
            <Box>
                <RawHtmlRenderer rawHtml={data.plot_Txy} />
                <DownloadChartButton svgContent={data.plot_Txy} fileName={`Txy chart ${label}`} />
            </Box>
            <Box>
                <RawHtmlRenderer rawHtml={data.plot_gamma} />
                <DownloadChartButton svgContent={data.plot_gamma} fileName={`gamma chart ${label}`} />
            </Box>
        </Stack>
    );
};
