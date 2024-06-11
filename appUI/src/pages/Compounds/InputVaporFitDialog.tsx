import { Dispatch, FC, useCallback, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    FormControlLabel,
    IconButton,
    Stack,
} from '@mui/material';
import { HelpOutline, KeyboardArrowDown, KeyboardArrowUp, TableView } from '@mui/icons-material';
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
import { spacingN } from '../../contexts/MUITheme.tsx';

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
    const [infoOpen, setInfoOpen] = useState(false);
    const [optimizeTp, setOptimizeTp] = useState(false);

    const paramNames = fromNamedParams(modelDef.nparams0)[0];

    // SPREADSHEET
    const getInitialData = () => generateEmptyCells(1, 2);
    const [data, setData] = useState<SpreadsheetData>(getInitialData);
    const isDataWhole = useMemo(() => isSpreadsheetDataWhole(filterEmptyRows(data)), [data]);

    // MUTATION
    const { perform, result } = useFitVaporResultsDialog();
    const handleOptimize = useCallback(() => {
        const nparams0 = toNamedParams(paramNames, params0);
        const [p_data, T_data] = transposeMatrix(toNumMatrix(filterEmptyRows(data)));
        perform(
            { compound, model_name: modelDef.name, p_data, T_data, nparams0, skip_T_p_optimization: !optimizeTp },
            setFitResults,
            handleClose,
        );
    }, [perform, compound, modelDef, params0, data, optimizeTp]);

    const isError = !isDataWhole;

    return (
        <>
            <Dialog fullWidth maxWidth="md" open={open}>
                <DialogTitleWithX handleClose={handleClose}>
                    Perform {modelDef.name} model fitting for {compound}
                </DialogTitleWithX>
                <DialogContent>
                    <p>Enter your measured pressure &amp; temperature data points and optimize the model parameters.</p>

                    <FormControlLabel
                        control={<Checkbox checked={optimizeTp} onChange={(e) => setOptimizeTp(e.target.checked)} />}
                        label="Enable T,p-optimization"
                        style={{ marginRight: 0 }}
                    />
                    <IconButton onClick={() => setInfoOpen((prev) => !prev)}>
                        <HelpOutline />
                        {infoOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                    <Collapse in={infoOpen}>
                        <Box ml={4}>
                            Two algorithms are available, but p-optimization is performed always:
                            <ul style={{ marginBottom: 0, marginTop: spacingN(1) }}>
                                <li>
                                    <u>p-optimization</u>: standard curve fitting, which only considers dependent
                                    variable residuals (<i>p</i>).
                                </li>
                                <li>
                                    <u>T,p-optimization</u>: considers both variables residuals (<i>T</i>, <i>p</i>).
                                    <br />
                                    The residuals are divided by intervals of <i>T</i> & <i>p</i> data respectively so
                                    that they can be summed.
                                    <br />
                                    When enabled, it's done as second step, starting from the p-optimized parameters.
                                    <br />
                                    Keep in mind it can be unstable.
                                </li>
                            </ul>
                        </Box>
                    </Collapse>

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
