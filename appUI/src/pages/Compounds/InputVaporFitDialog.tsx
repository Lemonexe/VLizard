import { Dispatch, FC, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, Stack } from '@mui/material';
import { TableView } from '@mui/icons-material';
import { ErrorLabel } from '../../components/dataViews/TooltipIcons.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { VaporModelDef } from '../../adapters/api/types/vaporTypes.ts';
import { TableSpreadsheet } from '../../components/Spreadsheet/TableSpreadsheet.tsx';
import {
    filterEmptyRows,
    generateEmptyCells,
    isSpreadsheetDataWhole,
    SpreadsheetData,
    toNumMatrix,
    transposeMatrix,
} from '../../adapters/logic/spreadsheet.ts';
import { SpreadsheetControls } from '../../components/SpreadsheetControls/SpreadsheetControls.tsx';
import { useFitVaporResultsDialog } from '../../actions/FitVapor/useFitVaporResultsDialog.tsx';
import { fromNamedParams, toNamedParams } from '../../adapters/logic/nparams.ts';

const tableSpreadsheetHeaders = ['p/kPa', 'T/K'];

type InputVaporFitProps = DialogProps & {
    compound: string;
    modelDef: VaporModelDef;
    params0: number[];
    setFitResults: Dispatch<number[]>;
};

export const InputVaporFitDialog: FC<InputVaporFitProps> = ({
    open,
    handleClose,
    compound,
    modelDef,
    params0,
    setFitResults,
}) => {
    const paramNames = fromNamedParams(modelDef.nparams0)[0];

    // SPREADSHEET
    const getInitialData = () => generateEmptyCells(1, 2);
    const [data, setData] = useState<SpreadsheetData>(getInitialData);
    const isDataWhole = isSpreadsheetDataWhole(filterEmptyRows(data));

    // MUTATION
    const { perform, result } = useFitVaporResultsDialog();
    const handleOptimize = () => {
        const nparams0 = toNamedParams(paramNames, params0);
        const [p_data, T_data] = transposeMatrix(toNumMatrix(filterEmptyRows(data)));
        perform({ compound, model_name: modelDef.name, p_data, T_data, nparams0 }, setFitResults, handleClose);
    };

    const isError = !isDataWhole;

    return (
        <>
            <Dialog fullWidth maxWidth="md" open={open}>
                <DialogTitleWithX handleClose={handleClose}>
                    Perform {modelDef.name} model fitting for {compound}
                </DialogTitleWithX>
                <DialogContent>
                    <p>Enter your measured pressure &amp; temperature data points and optimize the model parameters.</p>

                    <Stack direction="row" gap={2} mt={4}>
                        <TableSpreadsheet columnLabels={tableSpreadsheetHeaders} data={data} setData={setData} />
                        <SpreadsheetControls setData={setData} showRestoreData={false} />
                    </Stack>
                    {!isDataWhole && data.length > 1 && (
                        <Box pt={2}>
                            <ErrorLabel title="Data is incomplete!" />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ pt: 4 }}>
                    <Button onClick={handleClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleOptimize} variant="contained" startIcon={<TableView />} disabled={isError}>
                        Optimize
                    </Button>
                </DialogActions>
            </Dialog>
            {result}
        </>
    );
};
