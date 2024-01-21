import { FC } from 'react';
import { ContentType } from 'recharts/types/component/Tooltip';
import { Box, styled } from '@mui/material';
import { spacingN } from '../../contexts/MUITheme.tsx';

// common props for a 4:3 rectangular responsive chart
export const responsiveLineChartProps = {
    width: 800,
    height: 600,
    margin: { left: 30, bottom: 30, top: 10, right: 10 }, // left & bottom have to ensure enough room for axis labels
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
