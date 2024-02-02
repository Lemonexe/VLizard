import { ReactElement, useCallback, useState } from 'react';
import { useNotifyErrorMessage } from '../../adapters/api/helpers/getApiErrorMessage.ts';
import { useVaporAnalysis } from '../../adapters/api/useVapor.ts';
import { VaporAnalysisResponse } from '../../adapters/api/types/vaporTypes.ts';
import { VaporAnalysisDialog } from './VaporAnalysisDialog.tsx';
import { CompoundIdentifier } from '../../adapters/api/types/common.ts';
import { UseAnalysisDialogReturn } from '../types.ts';

export const useVaporAnalysisDialog = (props: CompoundIdentifier): UseAnalysisDialogReturn => {
    const [open, setOpen] = useState(false);
    const [elem, setElem] = useState<ReactElement | null>(null);

    const { mutate } = useVaporAnalysis();
    const onError = useNotifyErrorMessage();
    const onSuccess = (response: VaporAnalysisResponse) => {
        setOpen(true);
        setElem(<VaporAnalysisDialog open={true} handleClose={() => setOpen(false)} data={response} />);
    };

    const perform = useCallback(() => {
        mutate(props, { onSuccess, onError });
    }, [props, mutate]);

    return { perform, result: open ? elem : null };
};
