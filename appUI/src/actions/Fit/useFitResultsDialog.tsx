import { FC, ReactElement, useCallback, useMemo, useState } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { useFitAnalysis } from '../../adapters/api/useFit.ts';
import { FitAnalysisRequest } from '../../adapters/api/types/fitTypes.ts';
import { FitResultsDialog } from './FitResultsDialog.tsx';

const LoadingDialog: FC = () => (
    <Dialog open={true} fullWidth maxWidth="xs">
        <DialogContent sx={{ p: 4 }}>
            <h2>Working...</h2>
        </DialogContent>
    </Dialog>
);

export const useFitResultsDialog = () => {
    const [open, setOpen] = useState(false);
    const handleClose = useCallback(() => setOpen(false), []);
    const [elem, setElem] = useState<ReactElement | null>(null);

    const { mutate } = useFitAnalysis();

    const perform = useCallback(
        (props: FitAnalysisRequest) => {
            setOpen(true);
            setElem(<LoadingDialog />);
            mutate(props, {
                onSuccess: (res) => {
                    setElem(<FitResultsDialog open={true} handleClose={handleClose} req={props} data={res} />);
                },
            });
        },
        [mutate],
    );

    return useMemo(() => ({ perform, result: open ? elem : null }), [perform, open, elem]);
};
