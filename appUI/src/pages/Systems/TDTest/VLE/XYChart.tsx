import { FC } from 'react';
import { Line, LineChart, Tooltip as ChartTooltip, XAxis, YAxis } from 'recharts';
import { Box } from '@mui/material';
import { DownloadChartButton } from '../../../../components/DownloadChartButton.tsx';
import { toSigDgts } from '../../../../adapters/logic/numbers.ts';
import {
    chartPropsSq,
    createPoints,
    generateTooltipContent,
    useLineChartRef,
} from '../../../../adapters/io/charts.tsx';
import { VLEAnalysisResultsProps } from './VLEAnalysisResultsProps.ts';

const TooltipContent = generateTooltipContent(({ x, y }) => (
    <>
        x<sub>1</sub> = {toSigDgts(x, 3)}
        <br />y<sub>1</sub> = {toSigDgts(y, 3)}
    </>
));
const xLabel = { value: 'x1', position: 'bottom', offset: 5 };
const yLabel = { value: 'y1', position: 'left', angle: -90, offset: 10 };

export const XYChart: FC<VLEAnalysisResultsProps> = ({ label, data }) => {
    const points = createPoints('x', data.x_1, 'y', data.y_1);

    const chartRefXY = useLineChartRef();
    const fileNameXY = `XY chart ${label}`;

    return (
        <Box>
            <h3>XY chart</h3>
            <LineChart
                data={points}
                ref={chartRefXY}
                {...chartPropsSq}
                style={{ minHeight: 400, maxHeight: 600, height: '40vh' }}
            >
                <XAxis dataKey="x" type="number" label={xLabel} domain={[0, 1]} />
                <YAxis dataKey="y" type="number" label={yLabel} domain={[0, 1]} />
                <ChartTooltip content={TooltipContent} />
                <Line type="linear" dataKey="y" dot={{ stroke: 'black', strokeWidth: 2 }} strokeWidth={0} />
            </LineChart>
            <DownloadChartButton chartRef={chartRefXY} fileName={fileNameXY} />
        </Box>
    );
};
