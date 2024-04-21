import { Dispatch, SetStateAction } from 'react';
import { SpreadsheetData } from '../../adapters/logic/spreadsheet.ts';

export type SpreadsheetWrapperProps = {
    columnLabels: string[];
    rowLabels?: string[];
    data: SpreadsheetData;
    setData: Dispatch<SetStateAction<SpreadsheetData>>;
    forceUpdateVersion?: number;
};
