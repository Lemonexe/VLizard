import { ReactElement, useCallback, useState } from 'react';
import { useGammaTest } from '../../adapters/api/useTDTest.ts';
import { GammaTestResponse, TestRequest } from '../../adapters/api/types/TDTestTypes.ts';
import { UseAnalysisDialogReturn } from '../types.ts';
import { GammaTestDialog } from './GammaTestDialog.tsx';

export const useGammaTestDialog = (props: TestRequest): UseAnalysisDialogReturn => {
    const [open, setOpen] = useState(false);
    const [elem, setElem] = useState<ReactElement | null>(null);

    const { mutate } = useGammaTest();
    const onSuccess = (res: GammaTestResponse) => {
        setOpen(true);
        setElem(<GammaTestDialog open={true} handleClose={() => setOpen(false)} req={props} data={res} />);
    };

    const perform = useCallback(() => {
        mutate(props, { onSuccess });
    }, [props, mutate]);

    return { perform, result: open ? elem : null };
};
