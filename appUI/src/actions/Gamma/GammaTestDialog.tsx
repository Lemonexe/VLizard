import { FC } from 'react';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { Box, Dialog, DialogContent } from '@mui/material';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { GammaTestResponse, TestRequest } from '../../adapters/api/types/TDTestTypes.ts';
import { ConsistencyResult } from '../../components/AnalysisResults/ConsistencyResult.tsx';
import { RawHtmlRenderer } from '../../components/RawHtmlRenderer.tsx';
import { DownloadChartButton } from '../../components/DownloadChartButton.tsx';
import { toPercent } from '../../adapters/logic/numbers.ts';

type GammaTestDialogProps = DialogProps & { req: TestRequest; data: GammaTestResponse };

export const GammaTestDialog: FC<GammaTestDialogProps> = ({ open, handleClose, req, data }) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;
    const reasons = [];
    const commonMessage = ` ± ${toPercent(data.gamma_abs_tol, 1)}`;
    if (data.is_consistent) reasons.push('Both γi(xi=1) are close to 1');
    if (Math.abs(data.err_1) > data.gamma_abs_tol) reasons.push('γ1(x1=1) must be 1' + commonMessage);
    if (Math.abs(data.err_2) > data.gamma_abs_tol) reasons.push('γ2(x2=1) must be 1' + commonMessage);

    return (
        <Dialog fullScreen open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Gamma test for {label}</DialogTitleWithX>
            <DialogContent>
                <ConsistencyResult warnings={data.warnings} is_consistent={data.is_consistent} reasons={reasons} />
                <Box m={2}>
                    <code>&gamma;1(x1=1) = {(1 + data.err_1).toFixed(2)}</code>
                    <span style={{ display: 'inline-block', width: 30 }} />
                    <code> &Delta; {toPercent(data.err_1, 1)}</code>
                    <br />
                    <code>&gamma;2(x2=1) = {(1 + data.err_2).toFixed(2)}</code>
                    <span style={{ display: 'inline-block', width: 30 }} />
                    <code> &Delta; {toPercent(data.err_2, 1)}</code>
                    <br />
                    <br />
                    <code>&Delta; criterion = {toPercent(data.gamma_abs_tol, 1)}</code>
                </Box>
                <Box mt={3}>
                    <RawHtmlRenderer rawHtml={data.plot} />
                    <DownloadChartButton svgContent={data.plot} fileName={`gamma test chart ${label}`} />
                </Box>
            </DialogContent>
        </Dialog>
    );
};
