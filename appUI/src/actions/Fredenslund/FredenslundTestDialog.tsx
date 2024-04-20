import { FC } from 'react';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { Box, DialogContent } from '@mui/material';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { FredenslundTestRequest, FredenslundTestResponse } from '../../adapters/api/types/TDTestTypes.ts';
import { ConsistencyResult } from '../../components/AnalysisResults/ConsistencyResult.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';
import { toSigDgts } from '../../adapters/logic/numbers.ts';

type FredenslundTestDialogProps = DialogProps & { req: FredenslundTestRequest; data: FredenslundTestResponse };

export const FredenslundTestDialog: FC<FredenslundTestDialogProps> = ({ open, handleClose, req, data }) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;
    const reasons = [
        `Residuals of p, y_1, y_2
        ${data.is_consistent ? 'are all' : 'must all be'}
        < ${toSigDgts(data.criterion, 2)} %`,
    ];

    return (
        <ResponsiveDialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Fredenslund test for {label}</DialogTitleWithX>
            <DialogContent>
                <ConsistencyResult warnings={data.warnings} is_consistent={data.is_consistent} reasons={reasons} />
                <Box m={2}>
                    <p>
                        Using Legendre polynomial of order <strong>{data.legendre_order}</strong>
                    </p>
                    <p>Average residuals:</p>
                    <code>p : {toSigDgts(data.p_res_avg, 3)} %</code>
                    <br />
                    <code>y1: {toSigDgts(data.y_1_res_avg, 3)} %</code>
                    <br />
                    <code>y2: {toSigDgts(data.y_2_res_avg, 3)} %</code>
                    <br />
                    <br />
                    <code>criterion = {toSigDgts(data.criterion, 2)}</code>
                </Box>
                <Box mt={3}>
                    <PlotWithDownload svgContent={data.plot_g_E} fileName={`Fredenslund gE chart ${label}`} />
                </Box>
                <Box mt={3}>
                    <PlotWithDownload svgContent={data.plot_p_res} fileName={`Fredenslund p res chart ${label}`} />
                </Box>
                <Box mt={3}>
                    <PlotWithDownload svgContent={data.plot_y_1_res} fileName={`Fredenslund y1 res chart ${label}`} />
                </Box>
            </DialogContent>
        </ResponsiveDialog>
    );
};
