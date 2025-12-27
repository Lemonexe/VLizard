import { FC, PropsWithChildren } from 'react';

// Calculate linear HSL interpolation of dark green(x=0) through orange to red(x=1)
const greenToRed = (x: number) => `hsl(${(120 + x * (10 - 120)).toFixed(0)},100%,${(15 + x * (50 - 15)).toFixed(0)}%)`;

type GreenRedGradientValueProps = PropsWithChildren<{
    val: number;
    warnThreshold?: number;
    errThreshold?: number;
}>;

/**
 * Formatted value that has green color when under warning threshold, and goes through orange to red when approaching the error threshold.
 */
export const GreenRedGradientValue: FC<GreenRedGradientValueProps> = ({
    children,
    val,
    warnThreshold = 0.5,
    errThreshold = 1,
}) => {
    const x = Math.min(1, Math.max(0, (val - warnThreshold) / (errThreshold - warnThreshold)));
    return <span style={{ color: greenToRed(x) }}>{children}</span>;
};
