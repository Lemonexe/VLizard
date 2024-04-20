import { ReactElement, useCallback, useMemo, useState } from 'react';
import { LoadingDialog } from '../../components/Loader.tsx';
import { useVLEFit } from '../../adapters/api/useFit.ts';
import { FitAnalysisRequest } from '../../adapters/api/types/fitTypes.ts';
import { FitResultsDialog } from './FitResultsDialog.tsx';

export const useFitResultsDialog = () => {
    const [open, setOpen] = useState(false);
    const handleClose = useCallback(() => setOpen(false), []);
    const [elem, setElem] = useState<ReactElement | null>(null);

    const { mutate } = useVLEFit();

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
