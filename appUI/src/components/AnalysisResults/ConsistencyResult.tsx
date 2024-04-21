import { FC, Fragment, ReactNode } from 'react';
import { Alert, Stack } from '@mui/material';
import { AnalysisResult } from '../../adapters/api/types/common.ts';

type SummaryProps = { is_consistent: boolean; reasons: string[] };

const Summary: FC<SummaryProps> = ({ is_consistent, reasons }) => {
    const severity = is_consistent ? 'success' : 'error';
    const heading = is_consistent ? 'Data consistency proven' : 'Data consistency is disproven';
    const lines: ReactNode[] = [heading].concat(reasons).map((line) => <Fragment key={line} children={line} />);
    const lineNodes = lines.reduce<ReactNode[]>((acc, curr, i) => acc.concat(curr, <br key={i} />), []);
    lineNodes.pop();
    return <Alert severity={severity}>{lineNodes}</Alert>;
};

type ConsistencyResultProps = AnalysisResult & SummaryProps;

export const ConsistencyResult: FC<ConsistencyResultProps> = ({ warnings, is_consistent, reasons }) => {
    return (
        <Stack gap={1}>
            {warnings.map((message) => (
                <Alert key={message} severity="warning" children={message} />
            ))}
            <Summary is_consistent={is_consistent} reasons={reasons} />
        </Stack>
    );
};
