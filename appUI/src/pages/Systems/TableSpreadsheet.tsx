import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { SpreadsheetData } from '../../adapters/logic/spreadsheet.ts';

const spreadsheetHeaders = ['p/kPa', 'T/K', 'x1', 'y1'];

type TableSpreadsheetProps = {
    data: SpreadsheetData;
    setData: Dispatch<SetStateAction<SpreadsheetData>>;
    setTouched: Dispatch<boolean>;
};

export const TableSpreadsheet: FC<TableSpreadsheetProps> = ({ data, setData, setTouched }) => {
    const COLS = 4; // restrict table to 4 columns
    const n_R = data.length;
    const n_C = data[0]?.length ?? 0;

    // Crop data to the expected shape = n·4, in case user expands the table by pasting.
    useEffect(() => {
        setData((prev) => prev.map((row) => row.slice(0, COLS)));
    }, [n_R, n_C]);

    const handleChange = useCallback((newData: SpreadsheetData) => {
        setData(newData);
        setTouched(true);
    }, []);

    // see ParamsSpreadsheet.tsx for explanation of this weirdness
    return useMemo(
        () => <Spreadsheet data={data} onChange={handleChange} columnLabels={spreadsheetHeaders} />,
        [n_R, n_C],
    );
};
