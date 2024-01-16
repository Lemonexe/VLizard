import { FC, useMemo, useRef } from 'react';
import { Line, LineChart, Tooltip as ChartTooltip, XAxis, YAxis } from 'recharts';
import { Box, Button, Tooltip as MuiTooltip } from '@mui/material';
import { Download } from '@mui/icons-material';
import { generateTooltipContent, responsiveLineChartProps } from '../../adapters/charts.tsx';
import { downloadSvg } from '../../adapters/download.ts';
import { K2C } from '../../adapters/units.ts';
import { VaporAnalysisResponse } from '../../adapters/api/types/vapor.ts';

const TooltipContent = generateTooltipContent(({ x, y }) => (
    <>
        {x.toFixed(1)} °C
        <br />
        {y.toFixed(0)} kPa
    </>
));
const xLabel = { value: 't / °C', position: 'bottom', offset: 5 };
const yLabel = { value: 'p / kPa', position: 'left', angle: -90, offset: 10 };

type Point = { t: number; p: number };
type VaporAnalysisDialogResultsProps = { data: VaporAnalysisResponse };

export const VaporAnalysisDialogResults: FC<VaporAnalysisDialogResultsProps> = ({ data }) => {
    const chartRef = useRef(null);
    const points: Point[] = useMemo(
        () => data.T_tab.map((T, i) => ({ t: K2C(T), p: data.p_tab[i] })),
        [data.T_tab, data.p_tab],
    );

    const handleDownload = () => {
        if (!chartRef.current) return;
        // IDK how to properly type the ref placed on LineChart, which has current.container = div
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const svg: SVGElement = chartRef.current.container.firstChild;
        const fileName = `chart ${data.compound} ${data.model_name}`;
        downloadSvg(svg, fileName);
    };

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
                {...responsiveLineChartProps}
                style={{ minHeight: 400, maxHeight: 600, height: '60vh' }}
            >
                <XAxis dataKey="t" type="number" label={xLabel} />
                <YAxis dataKey="p" type="number" label={yLabel} />
                <ChartTooltip content={TooltipContent} />
                <Line type="linear" dataKey="p" stroke="#1690AE" dot={false} />
            </LineChart>
            <Box pt={3}>
                <Button onClick={handleDownload} variant="outlined" startIcon={<Download />}>
                    Save SVG
                </Button>
            </Box>
        </>
    );
};
