import { FC } from 'react';
import { Tooltip } from '@mui/material';
import { Info, Report, Warning } from '@mui/icons-material';
import { spacingN } from '../contexts/MUITheme.tsx';

export type TooltipIconProps = { title: string };

/*
    Shorthands for Icons with a Tooltip
*/

export const ErrorTooltip: FC<TooltipIconProps> = ({ title }) => (
    <Tooltip title={title} children={<Report color="error" />} />
);

export const WarningTooltip: FC<TooltipIconProps> = ({ title }) => (
    <Tooltip title={title} children={<Warning color="warning" />} />
);

export const InfoTooltip: FC<TooltipIconProps> = ({ title }) => (
    <Tooltip title={title} children={<Info color="info" />} />
);

/*
    Shorthands for Icons with a text label
*/

const commonStyle = { verticalAlign: 'middle', marginRight: spacingN(0.5) };

export const ErrorLabel: FC<TooltipIconProps> = ({ title }) => (
    <span>
        <Report color="error" style={commonStyle} />
        <small>{title}</small>
    </span>
);

export const WarningLabel: FC<TooltipIconProps> = ({ title }) => (
    <span>
        <Warning color="warning" style={commonStyle} />
        <small>{title}</small>
    </span>
);

export const InfoLabel: FC<TooltipIconProps> = ({ title }) => (
    <span>
        <Info color="action" style={commonStyle} />
        <small>{title}</small>
    </span>
);
