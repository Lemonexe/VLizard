import { FC, useMemo } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { Box, DialogContent } from '@mui/material';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { SlopeTestResponse, TestRequest } from '../../adapters/api/types/TDTestTypes.ts';
import { AnalysisWarnings } from '../../components/AnalysisResults/AnalysisWarnings.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';
import { fromRows, makeReadOnly, spreadsheetToSigDgts } from '../../adapters/logic/spreadsheet.ts';
import { toSigDgts } from '../../adapters/logic/numbers.ts';

const columnLabels = ['x1', 'd ln gamma1', 'd ln gamma2', 'residual'];

type SlopeTestDialogProps = DialogProps & { req: TestRequest; data: SlopeTestResponse };

export const SlopeTestDialog: FC<SlopeTestDialogProps> = ({ open, handleClose, req, data }) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;

    const spreadsheetData = useMemo(() => {
        const dataColumns = [data.x_1, data.d_ln_gamma_1, data.d_ln_gamma_2, data.P2P_res];
        return makeReadOnly(spreadsheetToSigDgts(fromRows(dataColumns), 4));
    }, [data]);

    return (
        <ResponsiveDialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Slope test for {label}</DialogTitleWithX>
            <DialogContent>
                <AnalysisWarnings warnings={data.warnings} />
                <Box m={2} mb={3}>
                    <code>avg residual = {toSigDgts(data.P2P_res_avg, 3)}</code>
                </Box>
                <Spreadsheet data={spreadsheetData} columnLabels={columnLabels} />
                <PlotWithDownload svgContent={data.plot} fileName={`slope test chart ${label}`} />
            </DialogContent>
        </ResponsiveDialog>
    );
};
