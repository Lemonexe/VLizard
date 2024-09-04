import { FC } from 'react';
import { Alert, Stack } from '@mui/material';
import { AnalysisResult } from '../../adapters/api/types/common.ts';
import { linesFromStrings } from '../../adapters/react.tsx';

type SummaryProps = { is_consistent: boolean; reasons: string[]; is_warning?: boolean };

const Summary: FC<SummaryProps> = ({ is_consistent, is_warning, reasons }) => {
    const severity = is_consistent ? (is_warning ? 'warning' : 'success') : 'error';
    const verdict = is_consistent ? (is_warning ? 'doubtful' : 'proven') : 'disproven';
    const heading = `Data consistency ${verdict}`;

    const lineNodes = linesFromStrings([heading].concat(reasons));

    return <Alert severity={severity}>{lineNodes}</Alert>;
};

type ConsistencyResultProps = AnalysisResult & SummaryProps;

export const ConsistencyResult: FC<ConsistencyResultProps> = ({ warnings, is_consistent, is_warning, reasons }) => {
    return (
        <Stack gap={1}>
            {warnings.map((message) => (
                <Alert key={message} severity="warning" children={message} />
            ))}
            <Summary is_consistent={is_consistent} is_warning={is_warning} reasons={reasons} />
        </Stack>
    );
};
