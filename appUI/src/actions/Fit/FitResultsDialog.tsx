import { FC, useMemo } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { Alert, Box, DialogContent } from '@mui/material';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { FitAnalysisRequest, FitAnalysisResponse, TabulatedDataset } from '../../adapters/api/types/fitTypes.ts';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { AnalysisWarnings } from '../../components/AnalysisResults/AnalysisWarnings.tsx';
import { RawHtmlRenderer } from '../../components/charts/RawHtmlRenderer.tsx';
import { DownloadChartButton } from '../../components/charts/DownloadChartButton.tsx';
import { makeReadOnly, matrixToSpreadsheetData } from '../../adapters/logic/spreadsheet.ts';
import { toSigDgts } from '../../adapters/logic/numbers.ts';

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
        <RawHtmlRenderer rawHtml={ds.xy_plot} />
        <DownloadChartButton svgContent={ds.xy_plot} fileName={`xy fit chart ${label} ${ds.name}`} />
        <RawHtmlRenderer rawHtml={ds.Txy_plot} />
        <DownloadChartButton svgContent={ds.Txy_plot} fileName={`Txy fit chart ${label} ${ds.name}`} />
        <RawHtmlRenderer rawHtml={ds.gamma_plot} />
        <DownloadChartButton svgContent={ds.gamma_plot} fileName={`gamma fit chart ${label} ${ds.name}`} />
    </Box>
);

type FitResultsDialogProps = DialogProps & { req: FitAnalysisRequest; data: FitAnalysisResponse };

export const FitResultsDialog: FC<FitResultsDialogProps> = ({ open, handleClose, req, data }) => {
    const system = `${req.compound1}-${req.compound2}`;
    const label = `${system} ${req.model_name}`;

    const spreadsheetData = useMemo(
        () => makeReadOnly(matrixToSpreadsheetData([Object.values(data.result_params)])),
        [data.result_params],
    );

    return (
        <ResponsiveDialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>
                Non-linear regression of {req.model_name} on {system}, {req.datasets.join(', ')}
            </DialogTitleWithX>
            <DialogContent>
                {!data.is_optimized && <Alert severity="info" children="Optimization not performed this time" />}
                <AnalysisWarnings warnings={data.warnings} />
                <Box my={6}>
                    initial residual = {toSigDgts(data.resid_init, 3)}
                    <br />
                    {data.is_optimized && <>final residual = {toSigDgts(data.resid_final ?? NaN, 3)}</>}
                </Box>
                <p>
                    <h4>Fitted model parameters</h4>
                </p>
                <Spreadsheet data={spreadsheetData} columnLabels={Object.keys(data.result_params)} />

                {data.tabulated_datasets.map((ds) => (
                    <DatasetDisplay key={ds.name} label={label} ds={ds} />
                ))}
            </DialogContent>
        </ResponsiveDialog>
    );
};
