import { FC } from 'react';
import { Box, Tooltip } from '@mui/material';
import { K2C } from '../../adapters/logic/units.ts';
import { VaporAnalysisResponse } from '../../adapters/api/types/vapor.ts';
import { RawHtmlRenderer } from '../../components/RawHtmlRenderer.tsx';
import { DownloadChartButton2 } from '../../components/DownloadChartButton.tsx';

type VaporAnalysisDialogResultsProps = { data: VaporAnalysisResponse };

export const VaporAnalysisDialogResults: FC<VaporAnalysisDialogResultsProps> = ({ data }) => (
    <>
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
            <DownloadChartButton2 svgContent={data.plot} fileName={`chart ${data.compound} ${data.model_name}`} />
        </Box>
    </>
);
