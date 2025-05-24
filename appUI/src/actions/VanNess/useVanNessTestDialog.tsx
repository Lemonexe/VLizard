import { ReactElement, useCallback, useState } from 'react';

import { VanNessTestRequest, VanNessTestResponse } from '../../adapters/api/types/TDTestTypes.ts';
import { useVanNessTest } from '../../adapters/api/useTDTest.ts';
import { UseAnalysisDialogReturn } from '../types.ts';

import { VanNessTestDialog } from './VanNessTestDialog.tsx';

export const useVanNessTestDialog = (props: VanNessTestRequest): UseAnalysisDialogReturn => {
    const [open, setOpen] = useState(false);
    const [elem, setElem] = useState<ReactElement | null>(null);

    const { mutate } = useVanNessTest();
    const onSuccess = (res: VanNessTestResponse) => {
        setOpen(true);
        setElem(<VanNessTestDialog open={true} handleClose={() => setOpen(false)} req={props} data={res} />);
    };

    const perform = useCallback(() => {
        mutate(props, { onSuccess });
    }, [props, mutate]);

    return { perform, result: open ? elem : null };
};
