import { FC } from 'react';
import { Box } from '@mui/material';
import { InfoLabel } from '../../../components/dataViews/TooltipIcons.tsx';

export const WagnerInfo: FC = () => (
    <Box mb={2}>
        <InfoLabel title="Wagner model requires real values of critical pressure & temperature, those won't be optimized." />
    </Box>
);
