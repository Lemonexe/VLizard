import { Alert, Stack } from '@mui/material';
import { FC } from 'react';

import { AnalysisResult } from '../../adapters/api/types/common.ts';

export const AnalysisWarnings: FC<AnalysisResult> = ({ warnings }) => {
    return warnings.length > 0 ? (
        <Stack gap={1}>
            {warnings.map((message) => (
                <Alert key={message} severity="warning" children={message} />
            ))}
        </Stack>
    ) : null;
};
