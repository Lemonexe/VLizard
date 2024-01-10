import { FC, useState } from 'react';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, Stack, TextField } from '@mui/material';
import { useData } from '../../contexts/DataContext.tsx';
import { ErrorLabel, InfoLabel, WarningLabel } from '../../components/TooltipIcons.tsx';
import { RestoreButton } from '../../components/Mui/RestoreButton.tsx';

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
    const { compoundNames, VLEData, systemNames } = useData();
    const modifyingSystem = Boolean(origCompound1 && origCompound2);
    const modifyingDataset = Boolean(modifyingSystem && origDataset);
    const [compound1, setCompound1] = useState(origCompound1 ?? '');
    const [compound2, setCompound2] = useState(origCompound2 ?? '');
    const [datasetName, setDatasetName] = useState(origDataset ?? '');

    // does system differ from the orig, if specified?
    const isSystemChanged = () => modifyingSystem && (compound1 !== origCompound1 || compound2 !== origCompound2);
    // does any data differ from the orig, if specified (either system, or both system+dataset)?
    const isDataChanged = () => isSystemChanged() || (modifyingDataset && datasetName !== origDataset);

    const isSwappedExistingSystem = () => systemNames.includes(`${compound2}-${compound1}`);

    const isUnknownCompound = (compound: string) => compound.length > 0 && !compoundNames.includes(compound);
    const willOverwriteDataset = (newDatasetName: string) =>
        (isDataChanged() || !modifyingDataset) &&
        VLEData?.find(({ system_name }) => system_name === `${compound1}-${compound2}`)?.datasets.find(
            ({ name }) => name === newDatasetName,
        );
    const areCompoundsSame = () => compound1.length > 0 && compound1 === compound2;
    const isError = () => areCompoundsSame();

    const restoreOrig = () => {
        origCompound1 && setCompound1(origCompound1);
        origCompound2 && setCompound2(origCompound2);
        origDataset && setDatasetName(origDataset);
    };
    const swapSystem = () => {
        setCompound2(compound1);
        setCompound1(compound2);
    };

    return (
        <Dialog fullScreen open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>
                {modifyingDataset ? 'Edit dataset' : modifyingSystem ? 'Add a dataset' : 'Add a system'}
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
                    <p>Here be table. Todo.</p>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleClose} variant="contained" disabled={isError()}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
