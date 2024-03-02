import { ReactElement, useCallback, useState } from 'react';
import { useHeringtonTest } from '../../adapters/api/useTDTest.ts';
import { HeringtonTestResponse, TestRequest } from '../../adapters/api/types/TDTestTypes.ts';
import { UseAnalysisDialogReturn } from '../types.ts';
import { HeringtonTestDialog } from './HeringtonTestDialog.tsx';

export const useHeringtonTestDialog = (props: TestRequest): UseAnalysisDialogReturn => {
    const [open, setOpen] = useState(false);
    const [elem, setElem] = useState<ReactElement | null>(null);

    const { mutate } = useHeringtonTest();
    const onSuccess = (res: HeringtonTestResponse) => {
        setOpen(true);
        setElem(<HeringtonTestDialog open={true} handleClose={() => setOpen(false)} req={props} data={res} />);
    };

    const perform = useCallback(() => {
        mutate(props, { onSuccess });
    }, [props, mutate]);

    return { perform, result: open ? elem : null };
};
