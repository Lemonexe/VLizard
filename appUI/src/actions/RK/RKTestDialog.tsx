import { FC } from 'react';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { Box, DialogContent } from '@mui/material';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { RKTestResponse, TestRequest } from '../../adapters/api/types/TDTestTypes.ts';
import { ConsistencyResult } from '../../components/AnalysisResults/ConsistencyResult.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';
import { toSigDgts } from '../../adapters/logic/numbers.ts';

type RKTestDialogProps = DialogProps & { req: TestRequest; data: RKTestResponse };

export const RKTestDialog: FC<RKTestDialogProps> = ({ open, handleClose, req, data }) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;
    const reasons = [`|D| ${data.is_consistent ? '<=' : '>'} ${toSigDgts(data.criterion, 3)}`];

    return (
        <ResponsiveDialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Redlich-Kister test for {label}</DialogTitleWithX>
            <DialogContent>
                <ConsistencyResult warnings={data.warnings} is_consistent={data.is_consistent} reasons={reasons} />
                <Box m={2}>
                    <code>D = {toSigDgts(data.D, 3)}</code>
                    <br />
                    <br />
                    <code>|a-b| = {toSigDgts(data.curve_dif, 3)}</code>
                    <br />
                    <code> a+b = {toSigDgts(data.curve_sum, 3)}</code>
                    <br />
                    <br />
                    <code>D criterion = {toSigDgts(data.criterion, 3)}</code>
                </Box>
                <PlotWithDownload svgContent={data.plot} fileName={`RK test chart ${label}`} />
            </DialogContent>
        </ResponsiveDialog>
    );
};
