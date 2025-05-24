import { Box, Button, Collapse, DialogContent, Stack, styled } from '@mui/material';
import { Dispatch, FC, useMemo, useState } from 'react';
import Spreadsheet from 'react-spreadsheet';

import { VaporFitRequest, VaporFitResponse } from '../../adapters/api/types/fitTypes.ts';
import { fromNamedParams } from '../../adapters/logic/nparams.ts';
import { sigDgtsMetrics, sigDgtsParams } from '../../adapters/logic/numbers.ts';
import { makeReadOnly, matrixToSpreadsheetData, spreadsheetToSigDgts } from '../../adapters/logic/spreadsheet.ts';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { AnalysisWarnings } from '../../components/AnalysisResults/AnalysisWarnings.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { ExpandHelpButton } from '../../components/Mui/ExpandHelpButton.tsx';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';

import { FitVaporResultsHelp } from './FitVaporResultsHelp.tsx';

const fitQualityMetrics = ['Root mean square', 'Average abs. deviation'];

const NormalCaseButton = styled(Button)({
    textTransform: 'initial',
});

type FitVaporResultsDialogProps = DialogProps & {
    req: VaporFitRequest;
    data: VaporFitResponse;
    setFitResults: Dispatch<number[]>;
};

export const FitVaporResultsDialog: FC<FitVaporResultsDialogProps> = ({
    open,
    handleClose,
    req,
    data,
    setFitResults,
}) => {
    const [infoOpen, setInfoOpen] = useState(false);

    const optimizedP = data.is_p_optimized;
    const optimizedTP = data.is_T_p_optimized;
    const paramNames = useMemo(() => fromNamedParams(data.nparams0)[0], [data]);
    const params0 = fromNamedParams(data.nparams0)[1];
    const paramsP = fromNamedParams(data.nparams_p)[1];
    const paramsTP = fromNamedParams(data.nparams_T_p)[1];

    const rowLabels = useMemo(() => {
        const rows = ['initial'];
        if (optimizedP) rows.push('p-optimized');
        if (optimizedTP) rows.push('T,p-optimized');
        return rows;
    }, [data]);

    const metricsSpreadsheetData = useMemo(() => {
        const rows = [[data.RMS0, data.AAD0]];
        if (optimizedP) rows.push([data.RMS_p!, data.AAD_p!]);
        if (optimizedTP) rows.push([data.RMS_T_p!, data.AAD_T_p!]);
        return makeReadOnly(spreadsheetToSigDgts(matrixToSpreadsheetData(rows), sigDgtsMetrics));
    }, [data]);

    const paramsSpreadsheetData = useMemo(() => {
        const rows = [params0];
        if (optimizedP) rows.push(paramsP);
        if (optimizedTP) rows.push(paramsTP);
        return makeReadOnly(spreadsheetToSigDgts(matrixToSpreadsheetData(rows), sigDgtsParams));
    }, [data]);

    const acceptP = () => {
        setFitResults([data.T_min, data.T_max, ...paramsP]);
        handleClose();
    };

    const acceptTP = () => {
        setFitResults([data.T_min, data.T_max, ...paramsTP]);
        handleClose();
    };

    return (
        <ResponsiveDialog maxWidth="xl" fullWidth open={open}>
            <DialogTitleWithX handleClose={handleClose}>
                Non-linear regression of {req.model_name} on {req.compound}
            </DialogTitleWithX>
            <DialogContent>
                <AnalysisWarnings warnings={data.warnings} />
                <h4 className="h-margin">Regression quality metrics</h4>
                <Spreadsheet data={metricsSpreadsheetData} columnLabels={fitQualityMetrics} rowLabels={rowLabels} />
                <h4 className="h-margin">Fitted model parameters</h4>
                <Spreadsheet data={paramsSpreadsheetData} columnLabels={paramNames} rowLabels={rowLabels} />
                <h4 className="h-margin">What to do with the results?</h4>
                <Stack direction="row" gap={2} mb={2}>
                    <NormalCaseButton variant="contained" color="error" onClick={handleClose}>
                        Reject
                    </NormalCaseButton>
                    {optimizedP && (
                        <NormalCaseButton variant="contained" onClick={acceptP}>
                            Accept {optimizedTP && 'p-optimized'}
                        </NormalCaseButton>
                    )}
                    {optimizedTP && (
                        <NormalCaseButton variant="contained" onClick={acceptTP}>
                            Accept T,p-optimized
                        </NormalCaseButton>
                    )}
                    <ExpandHelpButton infoOpen={infoOpen} setInfoOpen={setInfoOpen} />
                </Stack>
                <Box mb={3}>
                    <Collapse in={infoOpen}>
                        <FitVaporResultsHelp />
                    </Collapse>
                </Box>
                {data.plot_p && (
                    <>
                        <h4 className="h-margin">p-optimized model plot</h4>
                        <PlotWithDownload
                            svgContent={data.plot_p}
                            fileName={`p-fit chart ${req.compound} ${req.model_name}`}
                        />
                    </>
                )}
                {data.plot_T_p && (
                    <>
                        <h4 className="h-margin">T,p-optimized model plot</h4>
                        <PlotWithDownload
                            svgContent={data.plot_T_p}
                            fileName={`T,p-fit chart ${req.compound} ${req.model_name}`}
                        />
                    </>
                )}
            </DialogContent>
        </ResponsiveDialog>
    );
};
