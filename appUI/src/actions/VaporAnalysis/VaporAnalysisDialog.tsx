import { FC } from 'react';
import { Box, DialogContent, Tooltip } from '@mui/material';
import { useUoM_T } from '../../adapters/logic/UoM.ts';
import { VaporAnalysisResponse } from '../../adapters/api/types/vaporTypes.ts';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { RawHtmlRenderer } from '../../components/charts/RawHtmlRenderer.tsx';
import { DownloadChartButton } from '../../components/charts/DownloadChartButton.tsx';
import { AnalysisWarnings } from '../../components/AnalysisResults/AnalysisWarnings.tsx';

type VaporAnalysisDialogProps = DialogProps & { data: VaporAnalysisResponse };

export const VaporAnalysisDialog: FC<VaporAnalysisDialogProps> = ({ data, open, handleClose }) => {
    const { convert_T, unit_T } = useUoM_T();
    return (
        <ResponsiveDialog maxWidth="md" open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Vapor pressure analysis for {data.compound}</DialogTitleWithX>
            <DialogContent>
                <AnalysisWarnings warnings={data.warnings} />
                <Box pb={3}>
                    <p>Model: {data.model_name}</p>
                    <p>
                        <Tooltip title="Temperature range covered by data">
                            <span>
                                T<sub>min</sub> = {convert_T(data.T_min).toFixed(1)} {unit_T}
                                <br />T<sub>max</sub> = {convert_T(data.T_max).toFixed(1)} {unit_T}
                            </span>
                        </Tooltip>
                    </p>
                    <p>
                        <Tooltip title="Calculated normal boiling point">
                            <span>
                                T<sub>boil</sub> = {convert_T(data.T_boil).toFixed(1)} {unit_T}
                            </span>
                        </Tooltip>
                    </p>
                </Box>
                <RawHtmlRenderer rawHtml={data.plot} />
                <Box pt={1}>
                    <DownloadChartButton
                        svgContent={data.plot}
                        fileName={`chart ${data.compound} ${data.model_name}`}
                    />
                </Box>
            </DialogContent>
        </ResponsiveDialog>
    );
};
