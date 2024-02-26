import { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { SpreadsheetData } from '../adapters/logic/spreadsheet.ts';

type ParamsSpreadsheetProps = {
    data: SpreadsheetData;
    setData: Dispatch<SetStateAction<SpreadsheetData>>;
    model_param_names: string[];
};

export const ParamsSpreadsheet: FC<ParamsSpreadsheetProps> = ({ data, setData, model_param_names }) => {
    const n_p = model_param_names.length;
    const n_R = data.length;
    const n_C = data[0]?.length ?? 0;

    // Crop data to the expected shape = 1·n_p, in case user expands the table by pasting.
    useEffect(() => {
        setData((prev) => prev.slice(0, 1).map((row) => row.slice(0, n_p)));
    }, [n_R, n_C]);

    // Rerender Spreadsheet component only when its shape is expected to change.
    // It seems to keep its own data, so it doesn't need to be rerendered on data change like inputs.
    // This is a workaround for a bug where Spreadsheet ends up in an infinite render loop.
    return useMemo(
        () => <Spreadsheet data={data} onChange={setData} columnLabels={model_param_names} />,
        [model_param_names, n_R, n_C],
    );
};
