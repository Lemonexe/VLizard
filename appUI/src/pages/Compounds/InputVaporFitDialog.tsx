import { Dispatch, FC, useCallback, useMemo, useState } from 'react';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControlLabel, Stack } from '@mui/material';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { VaporModelDef } from '../../adapters/api/types/vaporTypes.ts';
import { TableSpreadsheet } from '../../components/Spreadsheet/TableSpreadsheet.tsx';
import {
    checkIsSpreadsheetDataWhole,
    generateEmptyCells,
    SpreadsheetData,
    toNumMatrix,
    transposeMatrix,
} from '../../adapters/logic/spreadsheet.ts';
import { ErrorLabel } from '../../components/dataViews/TooltipIcons.tsx';
import { SpreadsheetControls } from '../../components/SpreadsheetControls/SpreadsheetControls.tsx';
import { useFitVaporResultsDialog } from '../../actions/FitVapor/useFitVaporResultsDialog.tsx';
import { fromNamedParams, toNamedParams } from '../../adapters/logic/nparams.ts';

const tableSpreadsheetHeaders = ['p/kPa', 'T/K'];

type InputVaporFitProps = DialogProps & {
    compound: string;
    modelDef: VaporModelDef;
    params0: number[];
    setFittedParams: Dispatch<number[]>;
};

export const InputVaporFitDialog: FC<InputVaporFitProps> = ({
    open,
    handleClose,
    compound,
    modelDef,
    params0,
    setFittedParams,
}) => {
    const paramNames = fromNamedParams(modelDef.nparams0)[0];

    const [optimizeTp, setOptimizeTp] = useState(false);

    // SPREADSHEET
    const getInitialData = () => generateEmptyCells(1, 2);
    const [data, setData] = useState<SpreadsheetData>(getInitialData);
    const isDataWhole = useMemo(() => checkIsSpreadsheetDataWhole(data), [data]);

    // MUTATION
    const { perform, result } = useFitVaporResultsDialog();
    const handleOptimize = useCallback(() => {
        const nparams0 = toNamedParams(paramNames, params0);
        const [p_data, T_data] = transposeMatrix(toNumMatrix(data));
        perform(
            { compound, model_name: modelDef.name, p_data, T_data, nparams0, skip_T_p_optimization: !optimizeTp },
            setFittedParams,
        );
    }, [perform, compound, modelDef, params0, data, optimizeTp]);

    const isError = !isDataWhole;

    return (
        <>
            <Dialog fullScreen open={open}>
                <DialogTitleWithX handleClose={handleClose}>
                    Perform {modelDef.name} model fitting for {compound}
                </DialogTitleWithX>
                <DialogContent>
                    <p>Enter your measured pressure &amp; temperature data points and click OPTIMIZE.</p>
                    <p>
                        <strong>Two algorithms</strong> are available:
                    </p>
                    <ul style={{ margin: 0 }}>
                        <li>
                            <u>p-optimization</u>: standard curve fitting, which only considers dependent variable
                            residuals (<i>p</i>).
                            <br />
                            It is performed always.
                        </li>
                        <li>
                            <u>T,p-optimization</u>: considers both variables residuals (<i>T</i>, <i>p</i>).
                            <br />
                            When enabled, it's done as second step, starting from the p-optimized parameters.
                            <br />
                            Please note it can be unstable.
                        </li>
                    </ul>
                    <FormControlLabel
                        control={<Checkbox checked={optimizeTp} onChange={(e) => setOptimizeTp(e.target.checked)} />}
                        label="Enable T,p-optimization"
                    />

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
                    <Button onClick={handleOptimize} variant="contained" disabled={isError}>
                        Optimize
                    </Button>
                </DialogActions>
            </Dialog>
            {result}
        </>
    );
};
