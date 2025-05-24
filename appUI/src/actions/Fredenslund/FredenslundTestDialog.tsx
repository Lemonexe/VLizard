import { Box, DialogContent } from '@mui/material';
import { FC, useMemo } from 'react';

import { FredenslundTestRequest, FredenslundTestResponse } from '../../adapters/api/types/TDTestTypes.ts';
import { sigDgtsCrit, sigDgtsMetrics, toSigDgts } from '../../adapters/logic/numbers.ts';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { ConsistencyResult } from '../../components/AnalysisResults/ConsistencyResult.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { ResultsDisplayTable } from '../../components/Spreadsheet/ResultsDisplayTable.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';
import { useConfig } from '../../contexts/ConfigContext.tsx';

const columnLabels = ['x1', 'δp', 'Δy1', 'Δy2'];

type FredenslundTestDialogProps = DialogProps & { req: FredenslundTestRequest; data: FredenslundTestResponse };

export const FredenslundTestDialog: FC<FredenslundTestDialogProps> = ({ open, handleClose, req, data }) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;
    const { fredenslund_criterion } = useConfig();
    const reasons = [
        `Residuals of p, y_1, y_2
        ${data.is_consistent ? 'are all' : 'must all be'}
        < ${toSigDgts(fredenslund_criterion, sigDgtsCrit)}%`,
    ];

    const dataColumns = useMemo(() => [data.x_1, data.p_res, data.y_1_res, data.y_2_res], [data]);

    return (
        <ResponsiveDialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Fredenslund test for {label}</DialogTitleWithX>
            <DialogContent>
                <ConsistencyResult warnings={data.warnings} is_consistent={data.is_consistent} reasons={reasons} />
                <h4 className="h-margin">Results</h4>
                <Box ml={2} mb={4}>
                    <p>
                        Using Legendre polynomial of order <strong>{data.legendre_order}</strong>
                    </p>
                    <p>Average residuals:</p>
                    {/* prettier-ignore */}
                    <table>
                        <tbody>
                            <tr>
                                <td width="30"><i>p</i></td>
                                <td>{toSigDgts(data.p_res_avg, sigDgtsMetrics)}%</td>
                            </tr>
                            <tr>
                                <td><i>y<sub>1</sub></i></td>
                                <td>{toSigDgts(data.y_1_res_avg, sigDgtsMetrics)}%</td>
                            </tr>
                            <tr>
                                <td><i>y<sub>2</sub></i></td>
                                <td>{toSigDgts(data.y_2_res_avg, sigDgtsMetrics)}%</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>Criterion for average residuals is {toSigDgts(fredenslund_criterion, sigDgtsCrit)}%</p>
                </Box>

                <ResultsDisplayTable rawDataColumns={dataColumns} columnLabels={columnLabels} />

                <h4 className="h-margin">Legendre fitting plot</h4>
                <PlotWithDownload svgContent={data.plot_g_E} fileName={`Fredenslund gE chart ${label}`} />

                <h4 className="h-margin">Pressure residuals plot</h4>
                <PlotWithDownload svgContent={data.plot_p_res} fileName={`Fredenslund p res chart ${label}`} />

                <h4 className="h-margin">Vapor molar frac. residuals plot</h4>
                <PlotWithDownload svgContent={data.plot_y_1_res} fileName={`Fredenslund y1 res chart ${label}`} />
            </DialogContent>
        </ResponsiveDialog>
    );
};
