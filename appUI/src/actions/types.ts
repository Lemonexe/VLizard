import { ReactElement } from 'react';

export type UseAnalysisDialogReturn = {
    perform: () => void;
    result: ReactElement | null;
};
