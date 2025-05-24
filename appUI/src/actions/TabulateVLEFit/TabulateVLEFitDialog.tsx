import { DialogContent } from '@mui/material';
import { FC, useMemo } from 'react';

import { FitTabulateRequest, TabulatedDataset } from '../../adapters/api/types/fitTypes.ts';
import { display_T_vec } from '../../adapters/logic/UoM.ts';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { AnalysisWarnings } from '../../components/AnalysisResults/AnalysisWarnings.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { ResultsDisplayTable } from '../../components/Spreadsheet/ResultsDisplayTable.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';
import { useConfig } from '../../contexts/ConfigContext.tsx';
import { useData } from '../../contexts/DataContext.tsx';

type TabulateVLEFitDialogProps = DialogProps & { req: FitTabulateRequest; data: TabulatedDataset };

export const TabulateVLEFitDialog: FC<TabulateVLEFitDialogProps> = ({ open, handleClose, req, data }) => {
    const { findVLEModelByName } = useData();
    // findVLEModel is guaranteed; the procedure has just been successfully invoked
    const modelDisplayName = findVLEModelByName(req.model_name)!.display_name;
    const label = `${req.compound1}-${req.compound2} with ${modelDisplayName} for ${data.name}`;

    const { UoM_T } = useConfig();
    const columnLabels = useMemo(() => ['x1', 'y1', `T / ${UoM_T}`, 'gamma1', 'gamma2'], [UoM_T]);
    const dataColumns = useMemo(
        () => [data.x_1, data.y_1, display_T_vec(data.T, UoM_T), data.gamma_1, data.gamma_2],
        [data],
    );

    return (
        <ResponsiveDialog maxWidth="xl" fullWidth open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Tabulation of {label}</DialogTitleWithX>
            <DialogContent>
                <AnalysisWarnings warnings={data.warnings} />
                <ResultsDisplayTable rawDataColumns={dataColumns} columnLabels={columnLabels} />
                <PlotWithDownload svgContent={data.xy_plot} fileName={`xy fit chart ${label}`} />
                <PlotWithDownload svgContent={data.Txy_plot} fileName={`Txy fit chart ${label}`} />
                <PlotWithDownload svgContent={data.gamma_plot} fileName={`gamma fit chart ${label}`} />
            </DialogContent>
        </ResponsiveDialog>
    );
};
