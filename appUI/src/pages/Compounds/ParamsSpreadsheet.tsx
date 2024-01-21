import { Dispatch, FC, useCallback } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { Box } from '@mui/material';
import { SpreadsheetData } from '../../adapters/logic/spreadsheet.ts';
import { VaporModelDef } from '../../adapters/api/types/vapor.ts';

type ParamsSpreadsheetProps = {
    data: SpreadsheetData;
    setData: Dispatch<SpreadsheetData>;
    model: VaporModelDef;
};

export const ParamsSpreadsheet: FC<ParamsSpreadsheetProps> = ({ data, setData, model }) => {
    const n_p = model.param_names.length;
    const handleChange = useCallback(
        (newData: SpreadsheetData) => {
            const normalizedData = newData.map((row) => row.slice(0, n_p)).slice(0, 1);
            setData(normalizedData);
        },
        [n_p, setData],
    );
    return (
        <Box pt={3}>
            <Spreadsheet data={data} onChange={handleChange} columnLabels={model.param_names} />
        </Box>
    );
};
