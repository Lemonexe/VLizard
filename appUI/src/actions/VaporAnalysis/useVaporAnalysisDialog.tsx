import { ReactElement, useCallback, useState } from 'react';
import { useNotifyErrorMessage } from '../../adapters/api/helpers/getApiErrorMessage.ts';
import { useVaporAnalysis } from '../../adapters/api/useVapor.ts';
import { VaporAnalysisRequest, VaporAnalysisResponse } from '../../adapters/api/types/vaporTypes.ts';
import { UseAnalysisDialogReturn } from '../types.ts';
import { VaporAnalysisDialog } from './VaporAnalysisDialog.tsx';

export const useVaporAnalysisDialog = (props: VaporAnalysisRequest): UseAnalysisDialogReturn => {
    const [open, setOpen] = useState(false);
    const [elem, setElem] = useState<ReactElement | null>(null);

    const { mutate } = useVaporAnalysis();
    const onError = useNotifyErrorMessage();
    const onSuccess = (res: VaporAnalysisResponse) => {
        setOpen(true);
        setElem(<VaporAnalysisDialog open={true} handleClose={() => setOpen(false)} data={res} />);
    };

    const perform = useCallback(() => {
        mutate(props, { onSuccess, onError });
    }, [props, mutate]);

    return { perform, result: open ? elem : null };
};
