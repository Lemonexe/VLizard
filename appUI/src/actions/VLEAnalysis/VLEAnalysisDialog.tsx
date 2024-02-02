import { FC, useEffect, useState } from 'react';
import { TestDialogProps } from '../types.ts';
import { VLEAnalysisResponse } from '../../adapters/api/types/VLETypes.ts';
import { useVLEAnalysis } from '../../adapters/api/useVLE.ts';
import { useNotifyErrorMessage } from '../../adapters/api/helpers/getApiErrorMessage.ts';
import { Dialog, DialogContent } from '@mui/material';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { VLEAnalysisResults } from './VLEAnalysisResults.tsx';

export const VLEAnalysisDialog: FC<TestDialogProps> = ({ open, handleClose, compound1, compound2, dataset }) => {
    const [data, setData] = useState<VLEAnalysisResponse | null>(null);
    const { mutate } = useVLEAnalysis();
    const onError = useNotifyErrorMessage();

    const label = `${compound1}-${compound2} ${dataset}`;

    useEffect(() => {
        mutate({ compound1, compound2, dataset }, { onSuccess: setData, onError });
    }, []);

    return (
        <Dialog fullScreen open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>
                Visualize data for {compound1}-{compound2} {dataset}
            </DialogTitleWithX>
            <DialogContent>{data ? <VLEAnalysisResults label={label} data={data} /> : 'Loading...'}</DialogContent>
        </Dialog>
    );
};
