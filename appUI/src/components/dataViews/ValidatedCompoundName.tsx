import { Stack } from '@mui/material';
import { FC } from 'react';

import { CompoundIdentifier } from '../../adapters/api/types/common.ts';
import { useData } from '../../contexts/DataContext.tsx';

import { WarningTooltip } from './TooltipIcons.tsx';

export const ValidatedCompoundName: FC<CompoundIdentifier> = ({ compound }) => {
    const { compoundNames } = useData();
    return (
        <Stack direction="row" alignItems="center">
            <span>{compound}</span>
            {!compoundNames.includes(compound) && <WarningTooltip title="Unknown compound (no vapor pressure model)" />}
        </Stack>
    );
};
