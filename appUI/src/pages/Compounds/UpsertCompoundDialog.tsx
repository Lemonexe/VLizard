import { FC, useCallback, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from '@mui/material';
import { useData } from '../../contexts/DataContext.tsx';
import { useUpdateVaporModel } from '../../adapters/api/useVapor.ts';
import {
    checkIsSpreadsheetDataWhole,
    matrixToSpreadsheetData,
    SpreadsheetData,
    toNumMatrix,
} from '../../adapters/logic/spreadsheet.ts';
import { useNotifications } from '../../contexts/NotificationContext.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { ErrorLabel, InfoLabel, WarningLabel } from '../../components/dataViews/TooltipIcons.tsx';
import { RestoreButton } from '../../components/Mui/RestoreButton.tsx';
import { ParamsSpreadsheet } from '../../components/ParamsSpreadsheet.tsx';
import { DialogProps } from '../../adapters/types/DialogProps.ts';

const commonInputStyle = { maxWidth: 300 };
const numInputStyle = { width: 100 };
type UpsertCompoundDialogProps = DialogProps & { origCompound?: string };

export const UpsertCompoundDialog: FC<UpsertCompoundDialogProps> = ({ origCompound, open, handleClose }) => {
    // compoundNames & vaporDefs are guaranteed, see CompoundsTable.tsx
    const { compoundNames, vaporDefs, findCompound } = useData();
    const [compound, setCompound] = useState(origCompound ?? '');
    const getOrigModel = () => findCompound(origCompound ?? '');
    const [T_min, setT_min] = useState(() => getOrigModel()?.T_min ?? 0);
    const [T_max, setT_max] = useState(() => getOrigModel()?.T_max ?? 1000);
    const [model, setModel] = useState(() => getOrigModel()?.model_name ?? '');

    const findModelDef = (modelName: string) => vaporDefs!.find((vd) => vd.name === modelName);
    // currently selected model definition
    const modelDef = useMemo(() => findModelDef(model), [model]);

    // CHECKS
    const isEdit = Boolean(origCompound);
    const isCompoundChanged = isEdit && origCompound !== compound;
    const willReplace = origCompound !== compound && compoundNames.includes(compound);
    const tempError = T_min >= T_max || isNaN(T_min) || isNaN(T_max);

    // ACTIONS
    const restoreOrig = () => origCompound && setCompound(origCompound);

    // SPREADSHEET
    const getInitialParams = (modelName: string): number[] => {
        const modelParams0 = findModelDef(modelName)?.params0 ?? [0];
        // use model defaults, unless it's Editing existing compounds, using its original model
        if (!origCompound) return modelParams0;
        const origModel = findCompound(origCompound);
        if (!origModel || origModel.model_name !== modelName) return modelParams0;
        return Object.values(origModel.params);
    };
    const getInitialData = (modelName: string) => matrixToSpreadsheetData([getInitialParams(modelName)]);
    const [data, setData] = useState<SpreadsheetData>(() => getInitialData(model));
    const isDataWhole = useMemo(() => checkIsSpreadsheetDataWhole(data), [data]);

    // MUTATION
    const pushNotification = useNotifications();
    const { mutate } = useUpdateVaporModel();
    const handleSave = useCallback(() => {
        const params = toNumMatrix(data)[0];
        mutate(
            { compound, model_name: model, params, T_min, T_max },
            {
                onSuccess: () => {
                    pushNotification({ message: `Model ${model} for ${compound} saved.`, severity: 'success' });
                    handleClose();
                },
            },
        );
    }, [compound, data, model, T_min, T_max]);

    // OVERALL ERROR CHECK
    const isError = !compound || tempError || !isDataWhole;

    return (
        <Dialog fullScreen open={open}>
            <DialogTitleWithX handleClose={handleClose}>
                {isEdit ? 'Edit' : 'Add'} vapor pressure model
            </DialogTitleWithX>
            <DialogContent>
                <Stack direction="column" gap={2} pt={1}>
                    <Stack direction="row" gap={1} alignItems="center">
                        <TextField
                            label="Compound name"
                            variant="outlined"
                            value={compound}
                            onChange={(e) => setCompound(e.target.value)}
                            fullWidth
                            style={commonInputStyle}
                        />
                        {isCompoundChanged && !willReplace && (
                            <div>
                                <InfoLabel title="Compound name was changed (will be saved as a new one). Restore?" />
                                <RestoreButton onClick={restoreOrig} />
                            </div>
                        )}
                        {willReplace && <WarningLabel title="This will overwrite existing compound." />}
                    </Stack>
                    <FormControl fullWidth>
                        <InputLabel id="model">Model type</InputLabel>
                        <Select
                            labelId="model"
                            label="Model type"
                            value={model}
                            onChange={(e) => {
                                setModel(e.target.value);
                                setData(getInitialData(e.target.value));
                            }}
                            style={commonInputStyle}
                        >
                            {vaporDefs!.map((v) => (
                                <MenuItem key={v.name} value={v.name}>
                                    {v.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {modelDef && (
                        <Box>
                            <span>Temperature bounds of model validity (in Kelvin)</span>
                            <Stack direction="row" gap={1} alignItems="center" pt={1}>
                                <TextField
                                    type="number"
                                    label="min"
                                    value={T_min}
                                    onChange={(e) => setT_min(Number(e.target.value))}
                                    size="small"
                                    style={numInputStyle}
                                    inputProps={{ min: 0 }}
                                />
                                <TextField
                                    type="number"
                                    label="max"
                                    value={T_max}
                                    onChange={(e) => setT_max(Number(e.target.value))}
                                    size="small"
                                    style={numInputStyle}
                                    inputProps={{ min: 0 }}
                                />
                                {tempError && <ErrorLabel title="Invalid values." />}
                            </Stack>
                        </Box>
                    )}
                </Stack>
                {modelDef && (
                    <Box pt={3}>
                        <ParamsSpreadsheet data={data} setData={setData} model_param_names={modelDef.param_names} />
                    </Box>
                )}
                {modelDef && !isDataWhole && (
                    <Box pt={2}>
                        <ErrorLabel title="Data is incomplete!" />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" disabled={isError}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
