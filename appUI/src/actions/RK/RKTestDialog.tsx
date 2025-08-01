import { Box, DialogContent } from '@mui/material';
import { FC, useMemo } from 'react';

import { RKTestResponse, TestRequest } from '../../adapters/api/types/TDTestTypes.ts';
import { sigDgtsCrit, toSigDgts } from '../../adapters/logic/numbers.ts';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { ConsistencyResult } from '../../components/AnalysisResults/ConsistencyResult.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { ResultsDisplayTable } from '../../components/Spreadsheet/ResultsDisplayTable.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';

const columnLabels = ['x1', 'ln y1/y2'];

type RKTestDialogProps = DialogProps & { req: TestRequest; data: RKTestResponse };

export const RKTestDialog: FC<RKTestDialogProps> = ({ open, handleClose, req, data }) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;
    const reasons = [`|D| ${data.is_consistent ? '<=' : '>'} ${toSigDgts(data.D_criterion)}`];

    const dataColumns = useMemo(() => [data.x_1, data.curve], [data]);

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
                    <p>
                        D criterion is {toSigDgts(data.D_criterion, sigDgtsCrit)} (
                        {data.is_isobaric ? 'isobaric' : 'isothermal'})
                    </p>
                </Box>

                <ResultsDisplayTable rawDataColumns={dataColumns} columnLabels={columnLabels} />

                <h4>Area integration plot</h4>
                <PlotWithDownload svgContent={data.plot} fileName={`RK test chart ${label}`} />
            </DialogContent>
        </ResponsiveDialog>
    );
};
