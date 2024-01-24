import { FC } from 'react';
import { Line, LineChart, Tooltip as ChartTooltip, XAxis, YAxis } from 'recharts';
import { Box } from '@mui/material';
import { DownloadChartButton } from '../../../../components/DownloadChartButton.tsx';
import { toSigDgts } from '../../../../adapters/logic/numbers.ts';
import { K2C } from '../../../../adapters/logic/units.ts';
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
        x<sub>1</sub>,y<sub>1</sub> = {toSigDgts(x, 3)}
        <br />T = {toSigDgts(y, 3)}
    </>
));
const xLabel = { value: 'x1,y1', position: 'bottom', offset: 5 };
const yLabel = { value: 'T [°C]', position: 'left', angle: -90, offset: 10 };

export const TXYChart: FC<VLEAnalysisResultsProps> = ({ label, data: { x_1, y_1, T } }) => {
    const t = T.map(K2C);
    const pointsBoil = createPoints('xy', x_1, 'T1', t);
    const pointsDew = createPoints('xy', y_1, 'T2', t);
    const points = [...pointsBoil, ...pointsDew];
    const YDomain = getAxisRange(t, 5);

    const chartRefTXY = useLineChartRef();
    const fileNameTXY = `TXY chart ${label}`;

    return (
        <Box>
            <h3>TXY chart</h3>
            <LineChart
                data={points}
                ref={chartRefTXY}
                {...chartPropsSq}
                style={{ minHeight: 400, maxHeight: 600, height: '40vh' }}
            >
                <XAxis dataKey="xy" type="number" label={xLabel} domain={[0, 1]} />
                <YAxis dataKey="T1" type="number" label={yLabel} domain={YDomain} tickCount={6} />
                <ChartTooltip content={TooltipContent} />
                <Line type="linear" dataKey="T1" dot={{ stroke: 'blue', strokeWidth: 2 }} strokeWidth={0} />
                <Line type="linear" dataKey="T2" dot={{ stroke: 'red', strokeWidth: 2 }} strokeWidth={0} />
            </LineChart>
            <DownloadChartButton chartRef={chartRefTXY} fileName={fileNameTXY} />
        </Box>
    );
};
