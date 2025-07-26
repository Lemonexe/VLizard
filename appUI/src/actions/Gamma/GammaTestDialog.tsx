import { Box, DialogContent } from '@mui/material';
import { FC, ReactNode, useMemo } from 'react';
import Spreadsheet from 'react-spreadsheet';

import { GammaTestRequest, GammaTestResponse } from '../../adapters/api/types/TDTestTypes.ts';
import { fromNamedParams } from '../../adapters/logic/nparams.ts';
import { toFixed, toPercent, toPercentSigned } from '../../adapters/logic/numbers.ts';
import { makeReadOnly, matrixToSpreadsheetData, spreadsheetToSigDgts } from '../../adapters/logic/spreadsheet.ts';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { ConsistencyResult } from '../../components/AnalysisResults/ConsistencyResult.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';
import { useConfig } from '../../contexts/ConfigContext.tsx';

// prettier-ignore
const gamma_jsx = (i: ReactNode) => <><code>&gamma;</code><sub>{i}</sub></>

type GammaTestDialogProps = DialogProps & { req: GammaTestRequest; data: GammaTestResponse };

export const GammaTestDialog: FC<GammaTestDialogProps> = ({ open, handleClose, req, data }) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;
    const { gamma_abs_tol } = useConfig();
    const abs_tol_1 = gamma_abs_tol / 100;
    const reasons = [];
    const commonMessage = ` ± ${toPercent(abs_tol_1, 1)}`;

    const delta_gamma_1 = data.nparams.err_1;
    const delta_gamma_2 = data.nparams.err_2;

    if (data.is_consistent) reasons.push('Both γi(xi=1) are close to 1');
    if (Math.abs(delta_gamma_1) > abs_tol_1) reasons.push('γ1(x1=1) must be 1' + commonMessage);
    if (Math.abs(delta_gamma_2) > abs_tol_1) reasons.push('γ2(x2=1) must be 1' + commonMessage);

    const { columnLabels, paramsSpreadsheetData } = useMemo(() => {
        const nparams = { ...data.nparams };
        delete nparams.err_1;
        delete nparams.err_2;
        const [paramNames, paramsValues] = fromNamedParams(nparams);
        return {
            columnLabels: paramNames,
            paramsSpreadsheetData: makeReadOnly(spreadsheetToSigDgts(matrixToSpreadsheetData([paramsValues]))),
        };
    }, [data.nparams]);

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
                                <td width="75">{gamma_jsx(1)}(x<sub>1</sub>=1)</td>
                                <td width="100">{toFixed(1 + delta_gamma_1)}</td>
                                <td width="50">&Delta; {gamma_jsx(1)}</td>
                                <td>{toPercentSigned(delta_gamma_1, 1)}</td>
                            </tr>
                            <tr>
                                <td>{gamma_jsx(2)}(x<sub>2</sub>=1)</td>
                                <td>{toFixed(1 + delta_gamma_2)}</td>
                                <td>&Delta; {gamma_jsx(2)}</td>
                                <td>{toPercentSigned(delta_gamma_2, 1)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>
                        Criterion for |&Delta; {gamma_jsx('i')}| is {toPercent(abs_tol_1, 1)}
                    </p>
                </Box>

                <h4 className="h-margin">Fitted model parameters</h4>
                <Spreadsheet data={paramsSpreadsheetData} columnLabels={columnLabels} />

                <h4 className="h-margin">Extrapolated activity coefficients plot</h4>
                <PlotWithDownload svgContent={data.plot_gamma} fileName={`gamma test chart ${label}`} />
                {data.plot_phi && (
                    <>
                        <h4>Fugacity coefficient model plot</h4>
                        <PlotWithDownload svgContent={data.plot_phi} fileName={`gamma test chart ${label}`} />
                    </>
                )}
            </DialogContent>
        </ResponsiveDialog>
    );
};
