import { FC, useMemo } from 'react';
import { DialogContent } from '@mui/material';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { FitTabulateRequest, TabulatedDataset } from '../../adapters/api/types/fitTypes.ts';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';
import { useData } from '../../contexts/DataContext.tsx';

type TabulateVLEFitDialogProps = DialogProps & { req: FitTabulateRequest; data: TabulatedDataset };

export const TabulateVLEFitDialog: FC<TabulateVLEFitDialogProps> = ({ open, handleClose, req, data }) => {
    const { findVLEModelByName } = useData();
    // findVLEModel is guaranteed; the procedure has just been successfully invoked
    const modelDisplayName = useMemo(() => findVLEModelByName(req.model_name)!.display_name, [req.model_name]);
    const label = `${req.compound1}-${req.compound2} with ${modelDisplayName} for ${data.name}`;

    return (
        <ResponsiveDialog maxWidth="xl" fullWidth open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Tabulation of {label}</DialogTitleWithX>
            <DialogContent>
                <PlotWithDownload svgContent={data.xy_plot} fileName={`xy fit chart ${label}`} />
                <PlotWithDownload svgContent={data.Txy_plot} fileName={`Txy fit chart ${label}`} />
                <PlotWithDownload svgContent={data.gamma_plot} fileName={`gamma fit chart ${label}`} />
            </DialogContent>
        </ResponsiveDialog>
    );
};
