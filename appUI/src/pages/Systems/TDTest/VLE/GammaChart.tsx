import { FC } from 'react';
import { Line, LineChart, Tooltip as ChartTooltip, XAxis, YAxis } from 'recharts';
import { Box } from '@mui/material';
import { DownloadChartButton } from '../../../../components/DownloadChartButton.tsx';
import { toSigDgts } from '../../../../adapters/logic/numbers.ts';
import {
    chartPropsSq,
    createPoints,
    generateTooltipContent,
    getAxisRange,
    useLineChartRef,
} from '../../../../adapters/io/charts.tsx';
import { VLEAnalysisResultsProps } from './VLEAnalysisResultsProps.ts';

const TooltipContent = generateTooltipContent(({ x, y }) => (
    <>
        x<sub>1</sub> = {toSigDgts(x, 3)}
        <br />
        gamma = {toSigDgts(y, 3)}
    </>
));
const xLabel = { value: 'x1', position: 'bottom', offset: 5 };
const yLabel = { value: 'gamma', position: 'left', angle: -90, offset: 10 };

export const GammaChart: FC<VLEAnalysisResultsProps> = ({ label, data: { x_1, gamma_1, gamma_2 } }) => {
    const pointsGamma1 = [...createPoints('x', x_1, 'g1', gamma_1)];
    const pointsGamma2 = [...createPoints('x', x_1, 'g2', gamma_2)];
    const points = [...pointsGamma1, ...pointsGamma2];
    const YDomain = getAxisRange([...gamma_1, ...gamma_2], 0.1);

    const chartRefGamma = useLineChartRef();
    const fileNameGamma = `Gamma chart ${label}`;

    return (
        <Box>
            <h3>Activity coeffs chart</h3>
            <LineChart
                data={points}
                ref={chartRefGamma}
                {...chartPropsSq}
                style={{ minHeight: 400, maxHeight: 600, height: '40vh' }}
            >
                <XAxis dataKey="x" type="number" label={xLabel} domain={[0, 1]} />
                <YAxis dataKey="g1" type="number" label={yLabel} domain={YDomain} tickCount={6} />
                <ChartTooltip content={TooltipContent} />
                <Line type="linear" dataKey="g1" dot={{ stroke: 'red', strokeWidth: 2 }} strokeWidth={0} />
                <Line type="linear" dataKey="g2" dot={{ stroke: 'blue', strokeWidth: 2 }} strokeWidth={0} />
            </LineChart>
            <DownloadChartButton chartRef={chartRefGamma} fileName={fileNameGamma} />
        </Box>
    );
};
