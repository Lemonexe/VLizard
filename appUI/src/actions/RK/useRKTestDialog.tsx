import { ReactElement, useCallback, useState } from 'react';

import { RKTestResponse, TestRequest } from '../../adapters/api/types/TDTestTypes.ts';
import { useRKTest } from '../../adapters/api/useTDTest.ts';
import { UseAnalysisDialogReturn } from '../types.ts';

import { RKTestDialog } from './RKTestDialog.tsx';

export const useRKTestDialog = (props: TestRequest): UseAnalysisDialogReturn => {
    const [open, setOpen] = useState(false);
    const [elem, setElem] = useState<ReactElement | null>(null);

    const { mutate } = useRKTest();
    const onSuccess = (res: RKTestResponse) => {
        setOpen(true);
        setElem(<RKTestDialog open={true} handleClose={() => setOpen(false)} req={props} data={res} />);
    };

    const perform = useCallback(() => {
        mutate(props, { onSuccess });
    }, [props, mutate]);

    return { perform, result: open ? elem : null };
};
