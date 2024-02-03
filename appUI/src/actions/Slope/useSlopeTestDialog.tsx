import { ReactElement, useCallback, useState } from 'react';
import { useNotifyErrorMessage } from '../../adapters/api/helpers/getApiErrorMessage.ts';
import { useSlopeTest } from '../../adapters/api/useTDTest.ts';
import { SlopeTestResponse, TestRequest } from '../../adapters/api/types/TDTestTypes.ts';
import { UseAnalysisDialogReturn } from '../types.ts';
import { SlopeTestDialog } from './SlopeTestDialog.tsx';

export const useSlopeTestDialog = (props: TestRequest): UseAnalysisDialogReturn => {
    const [open, setOpen] = useState(false);
    const [elem, setElem] = useState<ReactElement | null>(null);

    const { mutate } = useSlopeTest();
    const onError = useNotifyErrorMessage();
    const onSuccess = (res: SlopeTestResponse) => {
        setOpen(true);
        setElem(<SlopeTestDialog open={true} handleClose={() => setOpen(false)} req={props} data={res} />);
    };

    const perform = useCallback(() => {
        mutate(props, { onSuccess, onError });
    }, [props, mutate]);

    return { perform, result: open ? elem : null };
};
