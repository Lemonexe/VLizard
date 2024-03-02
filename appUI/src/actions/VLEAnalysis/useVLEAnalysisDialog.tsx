import { ReactElement, useCallback, useState } from 'react';
import { useVLEAnalysis } from '../../adapters/api/useVLE.ts';
import { VLEAnalysisRequest, VLEAnalysisResponse } from '../../adapters/api/types/VLETypes.ts';
import { UseAnalysisDialogReturn } from '../types.ts';
import { VLEAnalysisDialog } from './VLEAnalysisDialog.tsx';

export const useVLEAnalysisDialog = (props: VLEAnalysisRequest): UseAnalysisDialogReturn => {
    const [open, setOpen] = useState(false);
    const [elem, setElem] = useState<ReactElement | null>(null);

    const { mutate } = useVLEAnalysis();
    const onSuccess = (res: VLEAnalysisResponse) => {
        setOpen(true);
        setElem(<VLEAnalysisDialog open={true} handleClose={() => setOpen(false)} req={props} data={res} />);
    };

    const perform = useCallback(() => {
        mutate(props, { onSuccess });
    }, [props, mutate]);

    return { perform, result: open ? elem : null };
};
