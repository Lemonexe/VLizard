import { FC } from 'react';
import { AnalysisResult } from '../adapters/api/types/common.ts';
import { Alert, Stack } from '@mui/material';

export const AnalysisWarnings: FC<AnalysisResult> = ({ warnings }) => {
    return warnings.length > 0 ? (
        <Stack gap={1}>
            {warnings.map((message) => (
                <Alert key={message} severity="warning" children={message} />
            ))}
        </Stack>
    ) : null;
};
