import { FC } from 'react';
import { Line, LineChart, Tooltip as ChartTooltip, XAxis, YAxis } from 'recharts';
import { Box, Tooltip as MuiTooltip } from '@mui/material';
import { chartPropsRect, createPoints, generateTooltipContent, useLineChartRef } from '../../adapters/io/charts.tsx';
import { K2C } from '../../adapters/logic/units.ts';
import { toSigDgts } from '../../adapters/logic/numbers.ts';
import { VaporAnalysisResponse } from '../../adapters/api/types/vapor.ts';
import { DownloadChartButton } from '../../components/DownloadChartButton.tsx';

const TooltipContent = generateTooltipContent(({ x, y }) => (
    <>
        {toSigDgts(x, 3)} °C
        <br />
        {toSigDgts(y, 3)} kPa
    </>
));
const xLabel = { value: 't / °C', position: 'bottom', offset: 5 };
const yLabel = { value: 'p / kPa', position: 'left', angle: -90, offset: 10 };

type VaporAnalysisDialogResultsProps = { data: VaporAnalysisResponse };

export const VaporAnalysisDialogResults: FC<VaporAnalysisDialogResultsProps> = ({ data }) => {
    const t = data.T_tab.map(K2C);
    const points = createPoints('t', t, 'p', data.p_tab);

    const chartRef = useLineChartRef();
    const fileName = `chart ${data.compound} ${data.model_name}`;

    return (
        <>
            <Box pb={6}>
                <p>Model: {data.model_name}</p>
                <p>
                    <MuiTooltip title="Temperature range covered by data">
                        <span>
                            t<sub>min</sub> = {K2C(data.T_min).toFixed(1)} °C
                            <br />t<sub>max</sub> = {K2C(data.T_max).toFixed(1)} °C
                        </span>
                    </MuiTooltip>
                </p>
                <p>
                    <MuiTooltip title="Normal boiling point">
                        <span>
                            t<sub>boil</sub> = {K2C(data.T_boil).toFixed(1)} °C
                        </span>
                    </MuiTooltip>
                </p>
            </Box>
            <LineChart
                data={points}
                ref={chartRef}
                {...chartPropsRect}
                style={{ minHeight: 600, maxHeight: 600, height: '60vh' }}
            >
                <XAxis dataKey="t" type="number" label={xLabel} />
                <YAxis dataKey="p" type="number" label={yLabel} />
                <ChartTooltip content={TooltipContent} />
                <Line type="linear" dataKey="p" stroke="#1690AE" dot={false} />
            </LineChart>
            <Box pt={3}>
                <DownloadChartButton chartRef={chartRef} fileName={fileName} />
            </Box>
        </>
    );
};
