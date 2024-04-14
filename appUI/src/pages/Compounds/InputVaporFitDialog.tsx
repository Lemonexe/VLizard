import { FC, useCallback, useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, Stack } from '@mui/material';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { VaporModelDef } from '../../adapters/api/types/vaporTypes.ts';
import { TableSpreadsheet } from '../Systems/TableSpreadsheet.tsx';
import { checkIsSpreadsheetDataWhole, generateEmptyCells, SpreadsheetData } from '../../adapters/logic/spreadsheet.ts';
import { ErrorLabel } from '../../components/dataViews/TooltipIcons.tsx';
import { SpreadsheetControls } from '../../components/SpreadsheetControls/SpreadsheetControls.tsx';

const tableSpreadsheetHeaders = ['T/K', 'p/kPa'];

type InputVaporFitProps = DialogProps & {
    compound: string;
    modelDef: VaporModelDef;
    params0: number[];
};

export const InputVaporFitDialog: FC<InputVaporFitProps> = ({ open, handleClose, compound, modelDef, params0 }) => {
    const handleOptimize = useCallback(() => {}, []);

    // SPREADSHEET
    const getInitialData = () => generateEmptyCells(1, 2);
    const [data, setData] = useState<SpreadsheetData>(getInitialData);
    const isDataWhole = useMemo(() => checkIsSpreadsheetDataWhole(data), [data]);

    // MUTATION
    console.log(params0);
    // TODO useFitResults, create new dialog..

    const isError = !isDataWhole;

    return (
        <Dialog fullScreen open={open}>
            <DialogTitleWithX handleClose={handleClose}>
                Perform {modelDef.name} model fitting for {compound}
            </DialogTitleWithX>
            <DialogContent>
                <p>
                    Enter your measured <i>p</i> and <i>T</i> data points:
                </p>
                <Stack direction="row" gap={2}>
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
    );
};
