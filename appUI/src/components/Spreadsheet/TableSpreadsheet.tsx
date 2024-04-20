import { Dispatch, FC, useCallback, useEffect, useMemo } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { SpreadsheetData } from '../../adapters/logic/spreadsheet.ts';
import { SpreadsheetWrapperProps } from './types.ts';

type TableSpreadsheetProps = SpreadsheetWrapperProps & { setTouched?: Dispatch<boolean> };

export const TableSpreadsheet: FC<TableSpreadsheetProps> = ({
    columnLabels,
    data,
    setData,
    setTouched,
    forceUpdateVersion,
}) => {
    const COLS = columnLabels.length; // restrict table to COLS columns
    const n_R = data.length;
    const n_C = data[0]?.length ?? 0;

    // Crop data to the expected shape = n·COLS, in case user expands the table by pasting.
    useEffect(() => {
        setData((prev) => prev.map((row) => row.slice(0, COLS)));
    }, [n_R, n_C]);

    const handleChange = useCallback((newData: SpreadsheetData) => {
        setData(newData);
        setTouched?.(true);
    }, []);

    // see ParamsSpreadsheet.tsx for explanation of this weirdness
    return useMemo(
        () => <Spreadsheet data={[...data]} onChange={handleChange} columnLabels={columnLabels} />,
        [n_R, n_C, forceUpdateVersion],
    );
};
