import { FC } from 'react';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { Box, DialogContent } from '@mui/material';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { GammaTestResponse, TestRequest } from '../../adapters/api/types/TDTestTypes.ts';
import { ConsistencyResult } from '../../components/AnalysisResults/ConsistencyResult.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';
import { toPercent, toPercentSigned } from '../../adapters/logic/numbers.ts';
import { useConfig } from '../../contexts/ConfigContext.tsx';

type GammaTestDialogProps = DialogProps & { req: TestRequest; data: GammaTestResponse };

export const GammaTestDialog: FC<GammaTestDialogProps> = ({ open, handleClose, req, data }) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;
    const { gamma_abs_tol } = useConfig();
    const abs_tol_1 = gamma_abs_tol / 100;
    const reasons = [];
    const commonMessage = ` ± ${toPercent(abs_tol_1, 1)}`;
    if (data.is_consistent) reasons.push('Both γi(xi=1) are close to 1');
    if (Math.abs(data.err_1) > abs_tol_1) reasons.push('γ1(x1=1) must be 1' + commonMessage);
    if (Math.abs(data.err_2) > abs_tol_1) reasons.push('γ2(x2=1) must be 1' + commonMessage);

    return (
        <ResponsiveDialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Gamma offset test for {label}</DialogTitleWithX>
            <DialogContent>
                <ConsistencyResult warnings={data.warnings} is_consistent={data.is_consistent} reasons={reasons} />
                <h4 className="h-margin">Results</h4>
                <Box ml={3} mb={4}>
                    {/* prettier-ignore */}
                    <table>
                        <tbody>
                            <tr>
                                <td width="75"><code>&gamma;</code><sub>1</sub>(x<sub>1</sub>=1)</td>
                                <td width="100">{(1 + data.err_1).toFixed(2)}</td>
                                <td width="25">&Delta;</td>
                                <td>{toPercentSigned(data.err_1, 1)}</td>
                            </tr>
                            <tr>
                                <td><code>&gamma;</code><sub>2</sub>(x<sub>2</sub>=1)</td>
                                <td>{(1 + data.err_2).toFixed(2)}</td>
                                <td>&Delta;</td>
                                <td>{toPercentSigned(data.err_2, 1)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>Criterion for &Delta; deviation is {toPercent(abs_tol_1, 1)}</p>
                </Box>
                <h4>Extrapolated activity coefficients plot</h4>
                <PlotWithDownload svgContent={data.plot} fileName={`gamma test chart ${label}`} />
            </DialogContent>
        </ResponsiveDialog>
    );
};
