import { Box, DialogContent, Stack } from '@mui/material';
import { FC, PropsWithChildren, useMemo } from 'react';

import { VLEAnalysisRequest, VLEAnalysisResponse } from '../../adapters/api/types/VLETypes.ts';
import { display_T, display_T_vec, display_p, display_p_vec } from '../../adapters/logic/UoM.ts';
import { toSigDgts } from '../../adapters/logic/numbers.ts';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { AnalysisWarnings } from '../../components/AnalysisResults/AnalysisWarnings.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { ResultsDisplayTable } from '../../components/Spreadsheet/ResultsDisplayTable.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';
import { useConfig } from '../../contexts/ConfigContext.tsx';

const Subtle = ({ children }: PropsWithChildren) => <span style={{ color: '#777' }}>{children}</span>;

const DataHeadline = ({ data }: { data: VLEAnalysisResponse }) => {
    const { UoM_T, UoM_p } = useConfig();
    const avg_T = `mean T: ${toSigDgts(display_T(data.T_avg, UoM_T))} ${UoM_T}`;
    const avg_p = `mean p: ${toSigDgts(display_p(data.p_avg, UoM_p))} ${UoM_p}`;

    // prettier-ignore
    if (data.is_isobaric === true) {
        return (
            <Box>
                Data is <b>isobaric</b>.<br />
                {avg_p}<br />
                <Subtle children={avg_T} />
            </Box>
        );
    }
    // prettier-ignore
    if (data.is_isobaric === false) {
        return (
            <Box>
                Data is <b>isothermal</b>.<br />
                {avg_T}<br />
                <Subtle children={avg_p} />
            </Box>
        );
    }
    // prettier-ignore
    return (
        <Box>
            Cannot determine if data is isobaric or isothermal!<br />
            {avg_p}<br />
            {avg_T}
        </Box>
    );
};

type VLEAnalysisDialogProps = DialogProps & { req: VLEAnalysisRequest; data: VLEAnalysisResponse };

export const VLEAnalysisDialog: FC<VLEAnalysisDialogProps> = ({ open, handleClose, req, data }) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;

    const { UoM_T, UoM_p } = useConfig();

    const columnLabels = useMemo(
        () => [`p / ${UoM_p}`, `T / ${UoM_T}`, 'x1', 'y1', 'gamma1', 'gamma2', `ps1 / ${UoM_p}`, `ps2 / ${UoM_p}`],
        [UoM_T, UoM_p],
    );

    const dataColumns = useMemo(
        () => [
            display_p_vec(data.p, UoM_p),
            display_T_vec(data.T, UoM_T),
            data.x_1,
            data.y_1,
            data.gamma_1,
            data.gamma_2,
            display_p_vec(data.ps_1, UoM_p),
            display_p_vec(data.ps_2, UoM_p),
        ],
        [data],
    );

    return (
        <ResponsiveDialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Visualize data for {label}</DialogTitleWithX>
            <DialogContent>
                <Stack gap={3}>
                    <AnalysisWarnings warnings={data.warnings} />
                    <DataHeadline data={data} />
                    <ResultsDisplayTable rawDataColumns={dataColumns} columnLabels={columnLabels} />
                    <h4 className="h-margin">xy plot</h4>
                    <PlotWithDownload svgContent={data.plot_xy} fileName={`xy chart ${label}`} />
                    <h4 className="h-margin">Txy plot</h4>
                    <PlotWithDownload svgContent={data.plot_Txy} fileName={`Txy chart ${label}`} />
                    <h4 className="h-margin">Activity coefficients plot</h4>
                    <PlotWithDownload svgContent={data.plot_gamma} fileName={`gamma chart ${label}`} />
                </Stack>
            </DialogContent>
        </ResponsiveDialog>
    );
};
