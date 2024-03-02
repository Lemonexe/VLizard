import { FC, useCallback, useMemo, useState } from 'react';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, Stack, TextField } from '@mui/material';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { ErrorLabel, InfoLabel, WarningLabel } from '../../components/dataViews/TooltipIcons.tsx';
import { SpreadsheetControls } from '../../components/SpreadsheetControls/SpreadsheetControls.tsx';
import { RestoreButton } from '../../components/Mui/RestoreButton.tsx';
import { useData } from '../../contexts/DataContext.tsx';
import {
    checkIsSpreadsheetDataWhole,
    fromRows,
    generateEmptyCells,
    SpreadsheetData,
    toNumMatrix,
    transposeMatrix,
} from '../../adapters/logic/spreadsheet.ts';
import { useUpsertVLEDataset } from '../../adapters/api/useVLE.ts';
import { useNotifications } from '../../contexts/NotificationContext.tsx';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { TableSpreadsheet } from './TableSpreadsheet.tsx';

const WarningNoCompound: FC = () => <WarningLabel title="Unknown compound (no vapor pressure model)." />;

const commonAutoCompleteProps = {
    freeSolo: true,
    fullWidth: true,
    forcePopupIcon: true,
    autoHighlight: true,
    autoSelect: true,
    className: 'medium-input',
};

type UpsertDatasetDialogProps = DialogProps & {
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

    // ACTIONS
    const restoreOrig = useCallback(() => {
        origCompound1 && setCompound1(origCompound1);
        origCompound2 && setCompound2(origCompound2);
        origDataset && setDatasetName(origDataset);
    }, [origCompound1, origCompound2, origDataset]);
    const swapSystem = useCallback(() => {
        setCompound2(compound1);
        setCompound1(compound2);
    }, [compound1, compound2]);

    // SPREADSHEET
    const getInitialData = (): SpreadsheetData => {
        if (!modifyingDataset) return generateEmptyCells(1, 4);
        const ds = findDataset(compound1, compound2, datasetName);
        if (!ds) return generateEmptyCells(1, 4);
        return fromRows([ds.p, ds.T, ds.x_1, ds.y_1]);
    };
    const initialData = useMemo(getInitialData, []);
    const [data, setData] = useState<SpreadsheetData>(getInitialData);
    const [touched, setTouched] = useState(false);
    const [forceUpdateVersion, setForceUpdateVersion] = useState(0);
    const handleRestoreData = useCallback(() => {
        setData(initialData);
        setTouched(false);
        // see TableSpreadsheet.ts, it rerenders 1) when table dimensions change, 2) when we force it (otherwise Restore Data would not take effect)
        setForceUpdateVersion((prev) => prev + 1);
    }, [initialData]);

    const isDataWhole = useMemo(() => checkIsSpreadsheetDataWhole(data), [data]);
    const isAnyFieldEmpty = !compound1 || !compound2 || !datasetName;

    // OVERALL ERROR CHECK
    const isError = () => !isDataWhole || areCompoundsSame() || isAnyFieldEmpty;

    // MUTATION
    const pushNotification = useNotifications();
    const { mutate } = useUpsertVLEDataset();
    const handleSave = useCallback(() => {
        const [p, T, x_1, y_1] = transposeMatrix(toNumMatrix(data));
        const ds = { compound1, compound2, dataset: datasetName, p, T, x_1, y_1 };
        mutate(ds, {
            onSuccess: () => {
                pushNotification({ message: `Dataset ${datasetName} saved.`, severity: 'success' });
                handleClose();
            },
        });
    }, [compound1, compound2, datasetName, data]);

    return (
        <Dialog fullScreen open={open}>
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
                            className="medium-input"
                        />
                        {willOverwriteDataset(datasetName) && (
                            <WarningLabel title="This will overwrite an existing dataset." />
                        )}
                    </Stack>
                    <Stack gap={1}>
                        {isDataChanged() && (
                            <div>
                                <InfoLabel title="One of the above was changed (data will be saved as new). Restore?" />
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
                        <TableSpreadsheet
                            data={data}
                            setData={setData}
                            setTouched={setTouched}
                            forceUpdateVersion={forceUpdateVersion}
                        />
                        <SpreadsheetControls
                            setData={setData}
                            showRestoreData={modifyingDataset && touched}
                            handleRestoreData={handleRestoreData}
                        />
                    </Stack>
                </Box>
                {!isDataWhole && data.length > 1 && (
                    <Box pt={2}>
                        <ErrorLabel title="Data is incomplete!" />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" disabled={isError()}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
