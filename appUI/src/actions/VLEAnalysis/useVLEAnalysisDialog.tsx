import { ReactElement, useCallback, useState } from 'react';
import { useNotifyErrorMessage } from '../../adapters/api/helpers/getApiErrorMessage.ts';
import { useVLEAnalysis } from '../../adapters/api/useVLE.ts';
import { VLEAnalysisResponse } from '../../adapters/api/types/VLETypes.ts';
import { VLEAnalysisDialog } from './VLEAnalysisDialog.tsx';
import { DatasetIdentifier } from '../../adapters/api/types/common.ts';
import { UseAnalysisDialogReturn } from '../types.ts';

export const useVLEAnalysisDialog = (props: DatasetIdentifier): UseAnalysisDialogReturn => {
    const label = `${props.compound1}-${props.compound2} ${props.dataset}`;
    const [open, setOpen] = useState(false);
    const [elem, setElem] = useState<ReactElement | null>(null);

    const { mutate } = useVLEAnalysis();
    const onError = useNotifyErrorMessage();
    const onSuccess = (response: VLEAnalysisResponse) => {
        setOpen(true);
        setElem(<VLEAnalysisDialog open={true} handleClose={() => setOpen(false)} data={response} label={label} />);
    };

    const perform = useCallback(() => {
        mutate(props, { onSuccess, onError });
    }, [props, mutate]);

    return { perform, result: open ? elem : null };
};
