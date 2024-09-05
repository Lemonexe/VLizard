import { ReactElement, useCallback, useMemo, useState } from 'react';
import { LoadingDialog } from '../../components/Loader.tsx';
import { useTabulateVLEFit } from '../../adapters/api/useFit.ts';
import { FitTabulateRequest, TabulatedDataset } from '../../adapters/api/types/fitTypes.ts';
import { TabulateVLEFitDialog } from './TabulateVLEFitDialog.tsx';

export const useTabulateVLEFitDialog = () => {
    const [open, setOpen] = useState(false);
    const [elem, setElem] = useState<ReactElement | null>(null);

    const { mutate } = useTabulateVLEFit();

    const perform = useCallback(
        (props: FitTabulateRequest) => {
            setOpen(true);
            setElem(<LoadingDialog />);
            mutate(props, {
                onError: () => setElem(null),
                onSuccess: (res: TabulatedDataset) => {
                    setElem(
                        <TabulateVLEFitDialog open={true} handleClose={() => setOpen(false)} req={props} data={res} />,
                    );
                },
            });
        },
        [mutate],
    );

    return useMemo(() => ({ perform, result: open ? elem : null }), [perform, open, elem]);
};
