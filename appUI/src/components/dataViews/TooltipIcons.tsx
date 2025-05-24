import { Info, Report, Warning } from '@mui/icons-material';
import { SvgIconOwnProps, Tooltip } from '@mui/material';
import { FC } from 'react';

import { spacingN } from '../../contexts/MUITheme.tsx';

export type TooltipIconProps = { title: string; color?: SvgIconOwnProps['color'] };

/*
    Shorthands for Icons with a Tooltip
*/

export const ErrorTooltip: FC<TooltipIconProps> = ({ title, color = 'error' }) => (
    <Tooltip title={title} children={<Report color={color} />} />
);

export const WarningTooltip: FC<TooltipIconProps> = ({ title, color = 'warning' }) => (
    <Tooltip title={title} children={<Warning color={color} />} />
);

export const InfoTooltip: FC<TooltipIconProps> = ({ title, color = 'info' }) => (
    <Tooltip title={title} children={<Info color={color} />} />
);

/*
    Shorthands for Icons with a text label
*/

const commonStyle = { verticalAlign: 'middle', marginRight: spacingN(0.5) };

export const ErrorLabel: FC<TooltipIconProps> = ({ title, color = 'error' }) => (
    <span>
        <Report color={color} style={commonStyle} />
        <small>{title}</small>
    </span>
);

export const WarningLabel: FC<TooltipIconProps> = ({ title, color = 'warning' }) => (
    <span>
        <Warning color={color} style={commonStyle} />
        <small>{title}</small>
    </span>
);

export const InfoLabel: FC<TooltipIconProps> = ({ title, color = 'action' }) => (
    <span>
        <Info color={color} style={commonStyle} />
        <small>{title}</small>
    </span>
);
