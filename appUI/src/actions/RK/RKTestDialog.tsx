import { Box, DialogContent } from '@mui/material';
import { FC } from 'react';

import { RKTestResponse, TestRequest } from '../../adapters/api/types/TDTestTypes.ts';
import { sigDgtsCrit, toSigDgts } from '../../adapters/logic/numbers.ts';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { ConsistencyResult } from '../../components/AnalysisResults/ConsistencyResult.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';
import { useConfig } from '../../contexts/ConfigContext.tsx';

type RKTestDialogProps = DialogProps & { req: TestRequest; data: RKTestResponse };

export const RKTestDialog: FC<RKTestDialogProps> = ({ open, handleClose, req, data }) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;
    const { rk_D_criterion } = useConfig();
    const reasons = [`|D| ${data.is_consistent ? '<=' : '>'} ${toSigDgts(rk_D_criterion)}`];

    return (
        <ResponsiveDialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Redlich-Kister test for {label}</DialogTitleWithX>
            <DialogContent>
                <ConsistencyResult warnings={data.warnings} is_consistent={data.is_consistent} reasons={reasons} />
                <h4 className="h-margin">Results</h4>
                <Box ml={3} mb={4}>
                    <table>
                        <tbody>
                            <tr>
                                <td width="70">D</td>
                                <td>{toSigDgts(data.D)}</td>
                            </tr>
                            <tr>
                                <td>|a–b|</td>
                                <td>{toSigDgts(data.curve_dif)}</td>
                            </tr>
                            <tr>
                                <td>a+b</td>
                                <td>{toSigDgts(data.curve_sum)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>D criterion is {toSigDgts(rk_D_criterion, sigDgtsCrit)}</p>
                </Box>
                <h4>Area integration plot</h4>
                <PlotWithDownload svgContent={data.plot} fileName={`RK test chart ${label}`} />
            </DialogContent>
        </ResponsiveDialog>
    );
};
