import { FC, useMemo } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { Box, Dialog, DialogContent, Stack } from '@mui/material';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { TestDialogProps } from '../types.ts';
import { VLEAnalysisResponse } from '../../adapters/api/types/VLETypes.ts';
import { fromRows, makeReadOnly } from '../../adapters/logic/spreadsheet.ts';
import { RawHtmlRenderer } from '../../components/RawHtmlRenderer.tsx';
import { DownloadChartButton } from '../../components/DownloadChartButton.tsx';

const columnLabels = ['p', 'T', 'x1', 'y1', 'gamma1', 'gamma2'];

type VLEAnalysisDialogProps = TestDialogProps & { data: VLEAnalysisResponse };

export const VLEAnalysisDialog: FC<VLEAnalysisDialogProps> = ({ open, handleClose, data, label }) => {
    const spreadsheetData = useMemo(
        () => makeReadOnly(fromRows([data.p, data.T, data.x_1, data.y_1, data.gamma_1, data.gamma_2])),
        [data],
    );

    return (
        <Dialog fullScreen open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Visualize data for {label}</DialogTitleWithX>
            <DialogContent>
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
            </DialogContent>
        </Dialog>
    );
};
