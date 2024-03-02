import { FC, useMemo } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { Box, DialogContent, Stack } from '@mui/material';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { VLEAnalysisRequest, VLEAnalysisResponse } from '../../adapters/api/types/VLETypes.ts';
import { fromRows, makeReadOnly } from '../../adapters/logic/spreadsheet.ts';
import { RawHtmlRenderer } from '../../components/charts/RawHtmlRenderer.tsx';
import { DownloadChartButton } from '../../components/charts/DownloadChartButton.tsx';
import { AnalysisWarnings } from '../../components/AnalysisResults/AnalysisWarnings.tsx';

const columnLabels = ['p', 'T', 'x1', 'y1', 'gamma1', 'gamma2'];

type VLEAnalysisDialogProps = DialogProps & { req: VLEAnalysisRequest; data: VLEAnalysisResponse };

export const VLEAnalysisDialog: FC<VLEAnalysisDialogProps> = ({ open, handleClose, req, data }) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;

    const spreadsheetData = useMemo(
        () => makeReadOnly(fromRows([data.p, data.T, data.x_1, data.y_1, data.gamma_1, data.gamma_2])),
        [data],
    );

    return (
        <ResponsiveDialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Visualize data for {label}</DialogTitleWithX>
            <DialogContent>
                <Stack gap={3}>
                    <AnalysisWarnings warnings={data.warnings} />
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
        </ResponsiveDialog>
    );
};
