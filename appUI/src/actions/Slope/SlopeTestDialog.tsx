import { Alert, DialogContent } from '@mui/material';
import { FC, useMemo } from 'react';

import { SlopeTestResponse, TestRequest } from '../../adapters/api/types/TDTestTypes.ts';
import { toSigDgts } from '../../adapters/logic/numbers.ts';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { AnalysisWarnings } from '../../components/AnalysisResults/AnalysisWarnings.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { ResultsDisplayTable } from '../../components/Spreadsheet/ResultsDisplayTable.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';

const columnLabels = ['x1', 'd ln gamma1', 'd ln gamma2', 'residual'];

type SlopeTestDialogProps = DialogProps & { req: TestRequest; data: SlopeTestResponse };

export const SlopeTestDialog: FC<SlopeTestDialogProps> = ({ open, handleClose, req, data }) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;

    const dataColumns = useMemo(() => [data.x_1, data.d_ln_gamma_1, data.d_ln_gamma_2, data.P2P_res], [data]);

    return (
        <ResponsiveDialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Slope test for {label}</DialogTitleWithX>
            <DialogContent>
                <Alert severity="info" sx={{ mb: 1 }}>
                    No conventional criteria, the test is only advisory.
                </Alert>
                <AnalysisWarnings warnings={data.warnings} />
                <p>Average residual = {toSigDgts(data.P2P_res_avg)}</p>
                <ResultsDisplayTable rawDataColumns={dataColumns} columnLabels={columnLabels} />
                <h4 className="h-margin">Residuals & derivations plots</h4>
                <PlotWithDownload svgContent={data.plot_residuals} fileName={`slope test chart ${label}`} />
                <PlotWithDownload svgContent={data.plot_derivations} fileName={`slope test diff chart ${label}`} />
            </DialogContent>
        </ResponsiveDialog>
    );
};
