import { FC } from 'react';
import { Box, Dialog, DialogContent, Tooltip } from '@mui/material';
import { K2C } from '../../adapters/logic/units.ts';
import { VaporAnalysisResponse } from '../../adapters/api/types/vaporTypes.ts';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { RawHtmlRenderer } from '../../components/RawHtmlRenderer.tsx';
import { DownloadChartButton } from '../../components/DownloadChartButton.tsx';

type VaporAnalysisDialogProps = DialogProps & { data: VaporAnalysisResponse };

export const VaporAnalysisDialog: FC<VaporAnalysisDialogProps> = ({ data, open, handleClose }) => (
    <Dialog fullScreen open={open} onClose={handleClose}>
        <DialogTitleWithX handleClose={handleClose}>Vapor pressure analysis for {data.compound}</DialogTitleWithX>
        <DialogContent>
            <Box pb={3}>
                <p>Model: {data.model_name}</p>
                <p>
                    <Tooltip title="Temperature range covered by data">
                        <span>
                            t<sub>min</sub> = {K2C(data.T_min).toFixed(1)} °C
                            <br />t<sub>max</sub> = {K2C(data.T_max).toFixed(1)} °C
                        </span>
                    </Tooltip>
                </p>
                <p>
                    <Tooltip title="Normal boiling point">
                        <span>
                            t<sub>boil</sub> = {K2C(data.T_boil).toFixed(1)} °C
                        </span>
                    </Tooltip>
                </p>
            </Box>
            <RawHtmlRenderer rawHtml={data.plot} />
            <Box pt={1}>
                <DownloadChartButton svgContent={data.plot} fileName={`chart ${data.compound} ${data.model_name}`} />
            </Box>
        </DialogContent>
    </Dialog>
);
