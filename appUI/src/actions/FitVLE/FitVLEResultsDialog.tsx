import { FC, useMemo } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { Alert, Box, DialogContent } from '@mui/material';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { FitAnalysisRequest, FitAnalysisResponse, TabulatedDataset } from '../../adapters/api/types/fitTypes.ts';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { AnalysisWarnings } from '../../components/AnalysisResults/AnalysisWarnings.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';
import { makeReadOnly, matrixToSpreadsheetData, spreadsheetToSigDgts } from '../../adapters/logic/spreadsheet.ts';
import { fromNamedParams } from '../../adapters/logic/nparams.ts';
import { toSigDgts } from '../../adapters/logic/numbers.ts';

const fitQualityMetrics = ['Root mean square', 'Average absolute deviation'];

type DatasetDisplayProps = {
    label: string;
    ds: TabulatedDataset;
};

const DatasetDisplay: FC<DatasetDisplayProps> = ({ label, ds }) => (
    <Box mt={8}>
        <h4>
            Dataset <q>{ds.name}</q>
        </h4>
        <Box mt={1}>
            <em>mean pressure:</em> {toSigDgts(ds.p_mean, 3)} kPa
        </Box>
        <PlotWithDownload svgContent={ds.xy_plot} fileName={`xy fit chart ${label} ${ds.name}`} />
        <PlotWithDownload svgContent={ds.Txy_plot} fileName={`Txy fit chart ${label} ${ds.name}`} />
        <PlotWithDownload svgContent={ds.gamma_plot} fileName={`gamma fit chart ${label} ${ds.name}`} />
    </Box>
);

type FitResultsDialogProps = DialogProps & { req: FitAnalysisRequest; data: FitAnalysisResponse };

export const FitVLEResultsDialog: FC<FitResultsDialogProps> = ({ open, handleClose, req, data }) => {
    const optimized = data.is_optimized;
    const system = `${req.compound1}-${req.compound2}`;
    const label = `${system} ${req.model_name}`;

    const param_names = useMemo(() => fromNamedParams(data.nparams0)[0], [data]);

    const rowLabels = useMemo(() => {
        const rows = ['initial'];
        if (optimized) rows.push('optimized');
        return rows;
    }, [data]);

    const metricsSpreadsheetData = useMemo(() => {
        const rows = [[data.RMS_init, data.AAD_init]];
        if (optimized) rows.push([data.RMS_final!, data.AAD_final!]);
        return makeReadOnly(spreadsheetToSigDgts(matrixToSpreadsheetData(rows), 3));
    }, [data]);

    const paramsSpreadsheetData = useMemo(() => {
        const params0 = fromNamedParams(data.nparams0)[1];
        const params = fromNamedParams(data.nparams)[1];
        const rows = [params0];
        if (optimized) rows.push(params);
        return makeReadOnly(spreadsheetToSigDgts(matrixToSpreadsheetData(rows), 6));
    }, [data]);

    return (
        <ResponsiveDialog maxWidth="xl" fullWidth open={open}>
            <DialogTitleWithX handleClose={handleClose}>
                Non-linear regression of {req.model_name} on {system}, {req.datasets.join(', ')}
            </DialogTitleWithX>
            <DialogContent>
                {!optimized && <Alert severity="info" children="Optimization not performed this time" />}
                <AnalysisWarnings warnings={data.warnings} />
                <h4 className="h-margin">Regression quality metrics</h4>
                <Spreadsheet data={metricsSpreadsheetData} columnLabels={fitQualityMetrics} rowLabels={rowLabels} />
                <h4 className="h-margin">Fitted model parameters</h4>
                <Spreadsheet data={paramsSpreadsheetData} columnLabels={param_names} rowLabels={rowLabels} />
                {data.tabulated_datasets.map((ds) => (
                    <DatasetDisplay key={ds.name} label={label} ds={ds} />
                ))}
            </DialogContent>
        </ResponsiveDialog>
    );
};
