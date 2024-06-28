import { FC, useMemo } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { DialogContent, Stack } from '@mui/material';
import { useConfig } from '../../contexts/ConfigContext.tsx';
import { display_p_vec, display_T_vec } from '../../adapters/logic/UoM.ts';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { VLEAnalysisRequest, VLEAnalysisResponse } from '../../adapters/api/types/VLETypes.ts';
import { fromRows, makeReadOnly, spreadsheetToSigDgts } from '../../adapters/logic/spreadsheet.ts';
import { AnalysisWarnings } from '../../components/AnalysisResults/AnalysisWarnings.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';

type VLEAnalysisDialogProps = DialogProps & { req: VLEAnalysisRequest; data: VLEAnalysisResponse };

export const VLEAnalysisDialog: FC<VLEAnalysisDialogProps> = ({ open, handleClose, req, data }) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;

    const { UoM_T, UoM_p } = useConfig();

    const columnLabels = useMemo(
        () => [`p / ${UoM_p}`, `T / ${UoM_T}`, 'x1', 'y1', 'gamma1', 'gamma2', `ps1 / ${UoM_p}`, `ps2 / ${UoM_p}`],
        [UoM_T, UoM_p],
    );

    const spreadsheetData = useMemo(() => {
        const dataColumns = [
            display_p_vec(data.p, UoM_p),
            display_T_vec(data.T, UoM_T),
            data.x_1,
            data.y_1,
            data.gamma_1,
            data.gamma_2,
            display_p_vec(data.ps_1, UoM_p),
            display_p_vec(data.ps_2, UoM_p),
        ];
        return makeReadOnly(spreadsheetToSigDgts(fromRows(dataColumns)));
    }, [data]);

    return (
        <ResponsiveDialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Visualize data for {label}</DialogTitleWithX>
            <DialogContent>
                <Stack gap={3}>
                    <AnalysisWarnings warnings={data.warnings} />
                    <Spreadsheet data={spreadsheetData} columnLabels={columnLabels} />
                    <h4 className="h-margin">xy plot</h4>
                    <PlotWithDownload svgContent={data.plot_xy} fileName={`xy chart ${label}`} />
                    <h4 className="h-margin">Txy plot</h4>
                    <PlotWithDownload svgContent={data.plot_Txy} fileName={`Txy chart ${label}`} />
                    <h4 className="h-margin">Activity coefficients plot</h4>
                    <PlotWithDownload svgContent={data.plot_gamma} fileName={`gamma chart ${label}`} />
                </Stack>
            </DialogContent>
        </ResponsiveDialog>
    );
};
