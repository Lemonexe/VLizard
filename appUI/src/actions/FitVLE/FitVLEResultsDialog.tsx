import { Alert, Box, DialogContent } from '@mui/material';
import { FC, useMemo } from 'react';
import Spreadsheet from 'react-spreadsheet';

import { FitAnalysisRequest, FitAnalysisResponse, PlottedDataset } from '../../adapters/api/types/fitTypes.ts';
import { display_T, display_p } from '../../adapters/logic/UoM.ts';
import { fromNamedParams } from '../../adapters/logic/nparams.ts';
import { sigDgtsMetrics, sigDgtsParams, toSigDgts } from '../../adapters/logic/numbers.ts';
import { makeReadOnly, matrixToSpreadsheetData, spreadsheetToSigDgts } from '../../adapters/logic/spreadsheet.ts';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { AnalysisWarnings } from '../../components/AnalysisResults/AnalysisWarnings.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';
import { useConfig } from '../../contexts/ConfigContext.tsx';
import { useData } from '../../contexts/DataContext.tsx';

const fitQualityMetrics = ['Root mean square', 'Average absolute deviation'];

type DatasetDisplayProps = {
    label: string;
    ds: PlottedDataset;
};

const DataHeadline = ({ ds }: { ds: PlottedDataset }) => {
    const { UoM_T, UoM_p } = useConfig();
    // unlike VLE parsed from data, the tabulated VLE is strictly either isobaric | isothermal (no indeterminate state)
    if (ds.T_spec) return `mean T: ${toSigDgts(display_T(ds.T_spec, UoM_T))} ${UoM_T}`;
    if (ds.p_spec) return `mean p: ${toSigDgts(display_p(ds.p_spec, UoM_p))} ${UoM_p}`;
};

const DatasetDisplay: FC<DatasetDisplayProps> = ({ label, ds }) => (
    <Box mt={8}>
        <h4 className="h-margin">
            Dataset <q>{ds.name}</q>
        </h4>
        <DataHeadline ds={ds} />
        <PlotWithDownload svgContent={ds.xy_plot} fileName={`xy fit chart ${label} ${ds.name}`} />
        {ds.Txy_plot && <PlotWithDownload svgContent={ds.Txy_plot} fileName={`Txy fit chart ${label} ${ds.name}`} />}
        {ds.pxy_plot && <PlotWithDownload svgContent={ds.pxy_plot} fileName={`pxy fit chart ${label} ${ds.name}`} />}
        <PlotWithDownload svgContent={ds.gamma_plot} fileName={`gamma fit chart ${label} ${ds.name}`} />
    </Box>
);

type FitResultsDialogProps = DialogProps & { req: FitAnalysisRequest; data: FitAnalysisResponse };

export const FitVLEResultsDialog: FC<FitResultsDialogProps> = ({ open, handleClose, req, data }) => {
    const { findVLEModelByName } = useData();
    // findVLEModel is guaranteed; the procedure has just been successfully invoked
    const modelDisplayName = findVLEModelByName(req.model_name)!.display_name;
    const optimized = data.is_optimized;
    const system = `${req.compound1}-${req.compound2}`;
    const label = `${system} ${modelDisplayName}`;

    const param_names = useMemo(() => fromNamedParams(data.nparams0)[0], [data]);

    const rowLabels = useMemo(() => {
        const rows = ['initial'];
        if (optimized) rows.push('optimized');
        return rows;
    }, [data]);

    const metricsSpreadsheetData = useMemo(() => {
        const rows = [[data.RMS0, data.AAD0]];
        if (optimized) rows.push([data.RMS_final!, data.AAD_final!]);
        return makeReadOnly(spreadsheetToSigDgts(matrixToSpreadsheetData(rows), sigDgtsMetrics));
    }, [data]);

    const paramsSpreadsheetData = useMemo(() => {
        const params0 = fromNamedParams(data.nparams0)[1];
        const params = fromNamedParams(data.nparams)[1];
        const rows = [params0];
        if (optimized) rows.push(params);
        return makeReadOnly(spreadsheetToSigDgts(matrixToSpreadsheetData(rows), sigDgtsParams));
    }, [data]);

    return (
        <ResponsiveDialog maxWidth="xl" fullWidth open={open}>
            <DialogTitleWithX handleClose={handleClose}>
                Non-linear regression of {modelDisplayName} on {system}, {req.datasets.join(', ')}
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
