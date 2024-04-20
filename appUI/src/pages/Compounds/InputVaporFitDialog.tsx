import { Dispatch, FC, useCallback, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControlLabel,
    IconButton,
    Stack,
} from '@mui/material';
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
import { HelpOutline } from '@mui/icons-material';

const AlgorithmInfoDialog: FC<DialogProps> = ({ open, handleClose }) => (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitleWithX handleClose={handleClose}>
            <strong>Two algorithms</strong> are available:
        </DialogTitleWithX>
        <DialogContent>
            <ul style={{ margin: 0 }}>
                <li>
                    <u>p-optimization</u>: standard curve fitting, which only considers dependent variable residuals (
                    <i>p</i>).
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
        </DialogContent>
    </Dialog>
);

const tableSpreadsheetHeaders = ['p/kPa', 'T/K'];

type InputVaporFitProps = DialogProps & {
    compound: string;
    modelDef: VaporModelDef;
    params0: number[];
    setFittedParams: Dispatch<number[]>;
};

export const InputVaporFitDialog: FC<InputVaporFitProps> = ({ compound, modelDef, params0, setFittedParams }) => {
    const paramNames = fromNamedParams(modelDef.nparams0)[0];

    const [infoOpen, setInfoOpen] = useState(false);

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
        <Box>
            <p>Enter your measured pressure &amp; temperature data points and click OPTIMIZE.</p>

            <FormControlLabel
                control={<Checkbox checked={optimizeTp} onChange={(e) => setOptimizeTp(e.target.checked)} />}
                label="Enable T,p-optimization"
            />
            <IconButton onClick={() => setInfoOpen(true)}>
                <HelpOutline />
            </IconButton>
            <AlgorithmInfoDialog open={infoOpen} handleClose={() => setInfoOpen(false)} />

            <Stack direction="row" gap={2} mt={4}>
                <TableSpreadsheet columnLabels={tableSpreadsheetHeaders} data={data} setData={setData} />
                <SpreadsheetControls setData={setData} showRestoreData={false} />
            </Stack>
            {!isDataWhole && data.length > 1 && (
                <Box pt={2}>
                    <ErrorLabel title="Data is incomplete!" />
                </Box>
            )}
            <Button onClick={handleOptimize} variant="contained" disabled={isError}>
                Optimize
            </Button>
            {result}
        </Box>
    );
};
