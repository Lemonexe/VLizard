import { ReactElement, useCallback, useMemo, useState } from 'react';

import { FitAnalysisRequest, FitAnalysisResponse } from '../../adapters/api/types/fitTypes.ts';
import { useVLEFit } from '../../adapters/api/useFit.ts';
import { LoadingDialog } from '../../components/Loader.tsx';

import { FitVLEResultsDialog } from './FitVLEResultsDialog.tsx';

export type PerformFitVLE = (props: FitAnalysisRequest) => void;

export const useFitVLEResultsDialog = () => {
    const [open, setOpen] = useState(false);
    const [elem, setElem] = useState<ReactElement | null>(null);

    const { mutate } = useVLEFit();

    const perform = useCallback<PerformFitVLE>(
        (props) => {
            setOpen(true);
            setElem(<LoadingDialog />);
            mutate(props, {
                onError: () => setElem(null),
                onSuccess: (res: FitAnalysisResponse) => {
                    setElem(
                        <FitVLEResultsDialog open={true} handleClose={() => setOpen(false)} req={props} data={res} />,
                    );
                },
            });
        },
        [mutate],
    );

    return useMemo(() => ({ perform, result: open ? elem : null }), [perform, open, elem]);
};
