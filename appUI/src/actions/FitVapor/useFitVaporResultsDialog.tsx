import { Dispatch, ReactElement, useCallback, useMemo, useState } from 'react';
import { LoadingDialog } from '../../components/Loader.tsx';
import { useVaporFit } from '../../adapters/api/useFit.ts';
import { VaporFitRequest } from '../../adapters/api/types/fitTypes.ts';
import { FitVaporResultsDialog } from './FitVaporResultsDialog.tsx';

export const useFitVaporResultsDialog = () => {
    const [open, setOpen] = useState(false);
    const handleClose = useCallback(() => setOpen(false), []);
    const [elem, setElem] = useState<ReactElement | null>(null);

    const { mutate } = useVaporFit();

    const perform = useCallback(
        (reqProps: VaporFitRequest, setFitResults: Dispatch<number[]>, onSettled: () => void) => {
            setOpen(true);
            setElem(<LoadingDialog />);
            mutate(reqProps, {
                onSettled,
                onSuccess: (res) => {
                    setElem(
                        <FitVaporResultsDialog
                            open={true}
                            handleClose={handleClose}
                            req={reqProps}
                            data={res}
                            setFitResults={setFitResults}
                        />,
                    );
                },
            });
        },
        [mutate],
    );

    return useMemo(() => ({ perform, result: open ? elem : null }), [perform, open, elem]);
};
