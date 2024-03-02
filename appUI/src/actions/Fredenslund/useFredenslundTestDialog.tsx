import { ReactElement, useCallback, useState } from 'react';
import { useFredenslundTest } from '../../adapters/api/useTDTest.ts';
import { FredenslundTestRequest, FredenslundTestResponse } from '../../adapters/api/types/TDTestTypes.ts';
import { UseAnalysisDialogReturn } from '../types.ts';
import { FredenslundTestDialog } from './FredenslundTestDialog.tsx';

export const useFredenslundTestDialog = (props: FredenslundTestRequest): UseAnalysisDialogReturn => {
    const [open, setOpen] = useState(false);
    const [elem, setElem] = useState<ReactElement | null>(null);

    const { mutate } = useFredenslundTest();
    const onSuccess = (res: FredenslundTestResponse) => {
        setOpen(true);
        setElem(<FredenslundTestDialog open={true} handleClose={() => setOpen(false)} req={props} data={res} />);
    };

    const perform = useCallback(() => {
        mutate(props, { onSuccess });
    }, [props, mutate]);

    return { perform, result: open ? elem : null };
};
