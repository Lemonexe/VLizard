import { ReactElement } from 'react';
import { DialogProps } from '../adapters/types/DialogProps.ts';

export type TestDialogProps = DialogProps & { label: string };

export type UseAnalysisDialogReturn = {
    perform: () => void;
    result: ReactElement | null;
};
