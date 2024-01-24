import { ElementRef, FC, useRef } from 'react';
import { LineChart } from 'recharts';
import { ContentType } from 'recharts/types/component/Tooltip';
import { Box, styled } from '@mui/material';
import { spacingN } from '../../contexts/MUITheme.tsx';

export const useLineChartRef = () => useRef<ElementRef<typeof LineChart>>(null);

export type Point = Record<string, number>;
type CreatePoints = (xKey: string, x: number[], yKey: string, y: number[]) => Point[];
export const createPoints: CreatePoints = (xKey, x, yKey, y) => x.map((val, i) => ({ [xKey]: val, [yKey]: y[i] }));
export const getAxisRange = (data: number[], significance = 1) => [
    Math.floor(Math.min(...data) / significance) * significance,
    Math.ceil(Math.max(...data) / significance) * significance,
];

// common props for a 4:3 rectangular responsive chart
export const chartPropsRect = {
    width: 800,
    height: 600,
    margin: { left: 30, bottom: 30, top: 10, right: 10 }, // left & bottom have to ensure enough room for axis labels
};
export const chartPropsSq = {
    ...chartPropsRect,
    width: 600,
};

const TooltipBox = styled(Box)({
    backgroundColor: '#fffa',
    border: '1px solid #6666',
    padding: spacingN(1),
});

type InnerComponentProps = { x: number; y: number };

/**
 * Higher order function that generates a tooltip content component for a recharts.
 * @param InnerComponent a component with x, y props, which renders the numerical values, box is already included
 * @returns a component that can be used in recharts <Tooltip content={} />
 */
export const generateTooltipContent = (InnerComponent: FC<InnerComponentProps>): ContentType<number, number> => {
    return ({ payload, label, active }) =>
        active ? (
            <TooltipBox>
                <InnerComponent x={label} y={payload?.[0].value ?? NaN} />
            </TooltipBox>
        ) : null;
};
