import { Dispatch, FC, useCallback, useMemo } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { Button, DialogContent, Stack, styled } from '@mui/material';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { VaporFitRequest, VaporFitResponse } from '../../adapters/api/types/fitTypes.ts';
import { AnalysisWarnings } from '../../components/AnalysisResults/AnalysisWarnings.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';
import { makeReadOnly, matrixToSpreadsheetData, spreadsheetToSigDgts } from '../../adapters/logic/spreadsheet.ts';
import { fromNamedParams } from '../../adapters/logic/nparams.ts';
import { sigDgtsMetrics, sigDgtsParams } from '../../adapters/logic/numbers.ts';

const fitQualityMetrics = ['Root mean square', 'Average abs. deviation'];

const NormalCaseButton = styled(Button)({
    textTransform: 'initial',
});

type FitVaporResultsDialogProps = DialogProps & {
    req: VaporFitRequest;
    data: VaporFitResponse;
    setFittedParams: Dispatch<number[]>;
};

export const FitVaporResultsDialog: FC<FitVaporResultsDialogProps> = ({
    open,
    handleClose,
    req,
    data,
    setFittedParams,
}) => {
    const optimizedP = data.is_optimized;
    const optimizedTP = data.is_T_p_optimized;
    const param_names = useMemo(() => fromNamedParams(data.nparams0)[0], [data]);
    const params0 = fromNamedParams(data.nparams0)[1];
    const paramsP = fromNamedParams(data.nparams_inter)[1];
    const paramsTP = fromNamedParams(data.nparams)[1];

    const rowLabels = useMemo(() => {
        const rows = ['initial'];
        if (optimizedP) rows.push('p-optimized');
        if (optimizedTP) rows.push('T,p-optimized');
        return rows;
    }, [data]);

    const metricsSpreadsheetData = useMemo(() => {
        const rows = [[data.RMS_init, data.AAD_init]];
        if (optimizedP) rows.push([data.RMS_inter!, data.AAD_inter!]);
        if (optimizedTP) rows.push([data.RMS_final!, data.AAD_final!]);
        return makeReadOnly(spreadsheetToSigDgts(matrixToSpreadsheetData(rows), sigDgtsMetrics));
    }, [data]);

    const paramsSpreadsheetData = useMemo(() => {
        const rows = [params0];
        if (optimizedP) rows.push(paramsP);
        if (optimizedTP) rows.push(paramsTP);
        return makeReadOnly(spreadsheetToSigDgts(matrixToSpreadsheetData(rows), sigDgtsParams));
    }, [data]);

    const acceptP = useCallback(() => {
        setFittedParams(paramsP);
        handleClose();
    }, [handleClose, setFittedParams, data]);

    const acceptTP = useCallback(() => {
        setFittedParams(paramsTP);
        handleClose();
    }, [handleClose, setFittedParams, data]);

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
                <Spreadsheet data={paramsSpreadsheetData} columnLabels={param_names} rowLabels={rowLabels} />
                <h4 className="h-margin">What to do with the results?</h4>
                <Stack direction="row" gap={2} mb={4}>
                    <NormalCaseButton variant="contained" color="error" onClick={handleClose}>
                        Reject
                    </NormalCaseButton>
                    <NormalCaseButton variant="contained" onClick={acceptP}>
                        Accept {optimizedTP && 'p-optimized'}
                    </NormalCaseButton>
                    {optimizedTP && (
                        <NormalCaseButton variant="contained" onClick={acceptTP}>
                            Accept T,p-optimized
                        </NormalCaseButton>
                    )}
                </Stack>
                <h4 className="h-margin">p-optimized model plot</h4>
                <PlotWithDownload svgContent={data.plot_p} fileName={`fit chart ${req.compound} ${req.model_name}`} />
                {data.plot_T_p && (
                    <>
                        <h4 className="h-margin">T,p-optimized model plot</h4>
                        <PlotWithDownload
                            svgContent={data.plot_T_p}
                            fileName={`fit chart ${req.compound} ${req.model_name}`}
                        />
                    </>
                )}
            </DialogContent>
        </ResponsiveDialog>
    );
};
