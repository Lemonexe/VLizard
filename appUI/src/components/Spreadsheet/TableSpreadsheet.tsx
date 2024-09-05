import { Dispatch, FC, useEffect, useMemo } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { SpreadsheetData } from '../../adapters/logic/spreadsheet.ts';
import { SpreadsheetWrapperProps } from './types.ts';

type TableSpreadsheetProps = SpreadsheetWrapperProps & { setTouched?: Dispatch<boolean> };

export const TableSpreadsheet: FC<TableSpreadsheetProps> = ({
    data,
    setData,
    columnLabels,
    rowLabels,
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

    const handleChange = (newData: SpreadsheetData) => {
        setData(newData);
        setTouched?.(true);
    };

    // see ParamsSpreadsheet.tsx for explanation of this weirdness
    return useMemo(
        () => (
            <Spreadsheet data={[...data]} onChange={handleChange} rowLabels={rowLabels} columnLabels={columnLabels} />
        ),
        [n_R, n_C, rowLabels, columnLabels, forceUpdateVersion],
    );
};
