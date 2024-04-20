import { FC, useMemo } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { DialogContent, Stack } from '@mui/material';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { VLEAnalysisRequest, VLEAnalysisResponse } from '../../adapters/api/types/VLETypes.ts';
import { fromRows, makeReadOnly } from '../../adapters/logic/spreadsheet.ts';
import { AnalysisWarnings } from '../../components/AnalysisResults/AnalysisWarnings.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';

const columnLabels = ['p', 'T', 'x1', 'y1', 'gamma1', 'gamma2', 'ps_1', 'ps_2'];

type VLEAnalysisDialogProps = DialogProps & { req: VLEAnalysisRequest; data: VLEAnalysisResponse };

export const VLEAnalysisDialog: FC<VLEAnalysisDialogProps> = ({ open, handleClose, req, data }) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;

    const spreadsheetData = useMemo(
        () =>
            makeReadOnly(
                fromRows([data.p, data.T, data.x_1, data.y_1, data.gamma_1, data.gamma_2, data.ps_1, data.ps_2]),
            ),
        [data],
    );

    return (
        <ResponsiveDialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Visualize data for {label}</DialogTitleWithX>
            <DialogContent>
                <Stack gap={3}>
                    <AnalysisWarnings warnings={data.warnings} />
                    <Spreadsheet data={spreadsheetData} columnLabels={columnLabels} />
                    <PlotWithDownload svgContent={data.plot_xy} fileName={`xy chart ${label}`} />
                    <PlotWithDownload svgContent={data.plot_Txy} fileName={`Txy chart ${label}`} />
                    <PlotWithDownload svgContent={data.plot_gamma} fileName={`gamma chart ${label}`} />
                </Stack>
            </DialogContent>
        </ResponsiveDialog>
    );
};
