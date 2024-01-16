import { FC, useCallback, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { QueryStats } from '@mui/icons-material';
import { useVaporAnalysis } from '../../adapters/api/useVapor.ts';
import { VaporAnalysisResponse } from '../../adapters/api/types/vapor.ts';
import { useNotifications } from '../../adapters/NotificationContext.tsx';
import { getApiErrorMessage } from '../../adapters/api/helpers/getApiErrorMessage.ts';
import { VaporAnalysisDialog } from './VaporAnalysisDialog.tsx';

type PerformAnalysisButtonProps = { compound: string };

export const PerformAnalysisButton: FC<PerformAnalysisButtonProps> = ({ compound }) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<VaporAnalysisResponse | null>(null);
    const pushNotification = useNotifications();
    const { mutate } = useVaporAnalysis();

    const performAnalysis = useCallback(() => {
        mutate(
            { compound },
            {
                onSuccess: (response) => {
                    setOpen(true);
                    setData(response);
                },
                onError: (e) => {
                    pushNotification({ message: `Error: ${getApiErrorMessage(e)}}`, severity: 'error' });
                },
            },
        );
    }, [compound, mutate]);

    return (
        <>
            <Tooltip title="Perform analysis">
                <IconButton children={<QueryStats />} onClick={performAnalysis} />
            </Tooltip>
            <VaporAnalysisDialog open={open} handleClose={() => setOpen(false)} data={data} />
        </>
    );
};
