import { FC, useMemo, useState, useCallback } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { Autocomplete, Box, Button, Dialog, DialogContent, Stack, TextField } from '@mui/material';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { ErrorLabel, InfoLabel, WarningLabel } from '../../components/TooltipIcons.tsx';
import { ProminentDialogActions } from '../../components/Mui/ProminentDialogActions.tsx';
import { SpreadsheetControls } from '../../components/SpreadsheetControls/SpreadsheetControls.tsx';
import { RestoreButton } from '../../components/Mui/RestoreButton.tsx';
import { useData } from '../../contexts/DataContext.tsx';
import { generateEmptyCells, SpreadsheetData, transposeMatrix } from '../../adapters/spreadsheet.ts';

const SpreadsheetHeaders = ['p/kPa', 'T/K', 'x1', 'y1'];

const WarningNoCompound: FC = () => <WarningLabel title="Unknown compound (no vapor pressure model)." />;

const commonAutoCompleteProps = {
    freeSolo: true,
    fullWidth: true,
    style: { maxWidth: 300 },
    forcePopupIcon: true,
    autoHighlight: true,
    autoSelect: true,
};

type UpsertDatasetDialogProps = {
    open: boolean;
    handleClose: () => void;
    // defined for Edit/Add dataset, undefined for Add system
    origCompound1?: string;
    origCompound2?: string;
    // defined for Edit dataset, undefined for Add dataset/system
    origDataset?: string;
};

export const UpsertDatasetDialog: FC<UpsertDatasetDialogProps> = ({
    open,
    handleClose,
    origCompound1,
    origCompound2,
    origDataset,
}) => {
    const { compoundNames, findDataset, systemNames } = useData();
    const [compound1, setCompound1] = useState(origCompound1 ?? '');
    const [compound2, setCompound2] = useState(origCompound2 ?? '');
    const [datasetName, setDatasetName] = useState(origDataset ?? '');

    // CHECKS
    const modifyingSystem = Boolean(origCompound1 && origCompound2);
    const modifyingDataset = Boolean(modifyingSystem && origDataset);

    // does system differ from the orig, if specified?
    const isSystemChanged = () => modifyingSystem && (compound1 !== origCompound1 || compound2 !== origCompound2);
    // does any data differ from the orig, if specified (either system, or both system+dataset)?
    const isDataChanged = () => isSystemChanged() || (modifyingDataset && datasetName !== origDataset);

    const isSwappedExistingSystem = () => systemNames.includes(`${compound2}-${compound1}`);

    const isUnknownCompound = (compound: string) => compound.length > 0 && !compoundNames.includes(compound);
    const willOverwriteDataset = (newDatasetName: string) =>
        (isDataChanged() || !modifyingDataset) && findDataset(compound1, compound2, newDatasetName);
    const areCompoundsSame = () => compound1.length > 0 && compound1 === compound2;
    // overall error check
    const isError = () => areCompoundsSame();

    // ACTIONS
    const restoreOrig = () => {
        origCompound1 && setCompound1(origCompound1);
        origCompound2 && setCompound2(origCompound2);
        origDataset && setDatasetName(origDataset);
    };
    const swapSystem = () => {
        setCompound2(compound1);
        setCompound1(compound2);
    };

    // SPREADSHEET
    const getInitialData = (): SpreadsheetData => {
        if (!modifyingDataset) return generateEmptyCells(1, 4);
        const ds = findDataset(compound1, compound2, datasetName);
        if (!ds) return generateEmptyCells(1, 4);
        const rows = [ds.p, ds.T, ds.x_1, ds.y_1];
        const cols = transposeMatrix(rows);
        return cols.map((row) => row.map((cell) => ({ value: cell })));
    };
    const initialData = useMemo(getInitialData, []);
    const [data, setData] = useState<SpreadsheetData>(getInitialData);
    const [touched, setTouched] = useState(false);
    const handleChange = useCallback((newData: SpreadsheetData) => {
        const normalizedData = newData.map((row) => row.slice(0, 4));
        setData(normalizedData);
        setTouched(true);
    }, []);

    return (
        <Dialog fullScreen open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>
                {modifyingDataset
                    ? 'Edit existing dataset'
                    : `Add a new dataset (${modifyingSystem ? 'existing' : 'new'} binary system)`}
            </DialogTitleWithX>
            <DialogContent>
                <Stack direction="column" gap={2} pt={1}>
                    <Stack direction="row" gap={1} alignItems="center">
                        <Autocomplete
                            options={compoundNames}
                            inputValue={compound1}
                            onInputChange={(_e, newInputValue) => setCompound1(newInputValue)}
                            renderInput={(params) => <TextField {...params} label="Compound 1" variant="outlined" />}
                            {...commonAutoCompleteProps}
                        />
                        {isUnknownCompound(compound1) && <WarningNoCompound />}
                    </Stack>
                    <Stack direction="row" gap={1} alignItems="center">
                        <Autocomplete
                            options={compoundNames}
                            inputValue={compound2}
                            onInputChange={(_e, newInputValue) => setCompound2(newInputValue)}
                            renderInput={(params) => <TextField {...params} label="Compound 2" variant="outlined" />}
                            {...commonAutoCompleteProps}
                        />
                        {isUnknownCompound(compound2) && <WarningNoCompound />}
                    </Stack>
                    <Stack direction="row" gap={1} alignItems="center">
                        <TextField
                            label="Dataset name"
                            variant="outlined"
                            value={datasetName}
                            onChange={(e) => setDatasetName(e.target.value)}
                            fullWidth
                            style={{ maxWidth: 300 }}
                        />
                        {willOverwriteDataset(datasetName) && (
                            <WarningLabel title="This will overwrite an existing dataset." />
                        )}
                    </Stack>
                    <Stack gap={1}>
                        {isDataChanged() && (
                            <div>
                                <InfoLabel title="One of the above was changed. Restore?" />
                                <RestoreButton onClick={restoreOrig} />
                            </div>
                        )}
                        {isSwappedExistingSystem() && (
                            <div>
                                <InfoLabel title={`Duplicate system found: ${compound2}-${compound1}. Swap?`} />
                                <RestoreButton onClick={swapSystem} />
                            </div>
                        )}
                        {areCompoundsSame() && (
                            <div>
                                <ErrorLabel title="Compounds must not be same!" />
                            </div>
                        )}
                    </Stack>
                </Stack>
                <Box pt={2}>
                    <Stack direction="row" gap={2}>
                        <Spreadsheet data={data} onChange={handleChange} columnLabels={SpreadsheetHeaders} />
                        <SpreadsheetControls
                            initialData={modifyingDataset ? initialData : undefined}
                            setData={setData}
                            touched={touched}
                            setTouched={setTouched}
                        />
                    </Stack>
                </Box>
            </DialogContent>
            <ProminentDialogActions>
                <Button onClick={handleClose} variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleClose} variant="contained" disabled={isError()}>
                    Save
                </Button>
            </ProminentDialogActions>
        </Dialog>
    );
};
