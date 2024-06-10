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
import { TableView } from '@mui/icons-material';
import { useData } from '../../contexts/DataContext.tsx';
import { useUpdateVaporModel } from '../../adapters/api/useVapor.ts';
import {
    isSpreadsheetDataWhole,
    matrixToSpreadsheetData,
    SpreadsheetData,
    toNumMatrix,
} from '../../adapters/logic/spreadsheet.ts';
import { fromNamedParams, toNamedParams } from '../../adapters/logic/nparams.ts';
import { useNotifications } from '../../contexts/NotificationContext.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { ErrorLabel, InfoLabel, WarningLabel } from '../../components/dataViews/TooltipIcons.tsx';
import { RestoreButton } from '../../components/Mui/RestoreButton.tsx';
import { ParamsSpreadsheet } from '../../components/Spreadsheet/ParamsSpreadsheet.tsx';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { InputVaporFitDialog } from './InputVaporFitDialog.tsx';

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
    const paramNames = useMemo(() => fromNamedParams(modelDef?.nparams0)[0], [modelDef]);
    const columnLabels = useMemo(() => fromNamedParams(modelDef?.param_labels)[1], [modelDef]);

    // CHECKS
    const isEdit = Boolean(origCompound);
    const isCompoundChanged = isEdit && origCompound !== compound;
    const willReplace = origCompound !== compound && compoundNames.includes(compound);
    const tempError = T_min >= T_max || isNaN(T_min) || isNaN(T_max);

    // ACTIONS
    const restoreOrig = () => origCompound && setCompound(origCompound);

    // SPREADSHEET
    const getInitialParams = (modelName: string): number[] => {
        const [, modelParams0] = fromNamedParams(findModelDef(modelName)?.nparams0);
        // use model defaults, unless it's Editing existing compounds, using its original model
        if (!origCompound) return modelParams0;
        const origModel = findCompound(origCompound);
        if (!origModel || origModel.model_name !== modelName) return modelParams0;
        return fromNamedParams(origModel.nparams)[1];
    };
    const getInitialData = (modelName: string) => matrixToSpreadsheetData([getInitialParams(modelName)]);
    const [data, setData] = useState<SpreadsheetData>(() => getInitialData(model));
    const isDataWhole = useMemo(() => isSpreadsheetDataWhole(data), [data]);
    const numData: number[] = useMemo(() => toNumMatrix(data)[0], [data]);
    const [forceUpdateVersion, setForceUpdateVersion] = useState(0);

    // MUTATION
    const pushNotification = useNotifications();
    const { mutate } = useUpdateVaporModel();
    const handleSave = useCallback(() => {
        const nparams = toNamedParams(paramNames, numData);
        mutate(
            { compound, model_name: model, nparams, T_min, T_max },
            {
                onSuccess: () => {
                    pushNotification({ message: `Model ${model} for ${compound} saved.`, severity: 'success' });
                    handleClose();
                },
            },
        );
    }, [compound, numData, model, T_min, T_max]);

    // FITTING
    const [fittingOpen, setFittingOpen] = useState(false);
    const handleOpenFitting = useCallback(() => setFittingOpen(true), []);
    const handleCloseFitting = useCallback(() => setFittingOpen(false), []);
    const setFitResults = useCallback((newResults: number[]) => {
        const [new_T_min, new_T_max, ...newParams] = newResults;
        setT_min(new_T_min);
        setT_max(new_T_max);
        setData(matrixToSpreadsheetData([newParams]));
        // forcefully rerender memoized Spreadsheet, see ParamsSpreadsheet.ts
        setForceUpdateVersion((prev) => prev + 1);
    }, []);

    // OVERALL ERROR CHECK
    const isError = !compound || tempError || !isDataWhole;

    return (
        <>
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
                                className="medium-input"
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
                                className="medium-input"
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
                                        className="num-input"
                                        inputProps={{ min: 0 }}
                                    />
                                    <TextField
                                        type="number"
                                        label="max"
                                        value={T_max}
                                        onChange={(e) => setT_max(Number(e.target.value))}
                                        size="small"
                                        className="num-input"
                                        inputProps={{ min: 0 }}
                                    />
                                    {tempError && <ErrorLabel title="Invalid values." />}
                                </Stack>
                            </Box>
                        )}
                        {modelDef && (
                            <Box mt={3}>
                                <h4>Model parameters</h4>
                                <p>
                                    Either fill in known values, <b>or</b> perform fitting using measured data, (then
                                    these values will be taken as initial estimate).
                                    <br />
                                    Either way, don't forget to SAVE afterwards.
                                </p>
                                <ParamsSpreadsheet
                                    data={data}
                                    setData={setData}
                                    rowLabels={['values']}
                                    columnLabels={columnLabels}
                                    forceUpdateVersion={forceUpdateVersion}
                                />
                                <Box mt={1}>
                                    <Button
                                        onClick={handleOpenFitting}
                                        variant="outlined"
                                        disabled={isError}
                                        startIcon={<TableView />}
                                    >
                                        Perform fitting
                                    </Button>
                                </Box>
                            </Box>
                        )}
                        {modelDef && !isDataWhole && <ErrorLabel title="Data is incomplete!" />}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ pt: 4 }}>
                    <Button onClick={handleClose} variant="outlined">
                        Cancel
                    </Button>

                    <Button onClick={handleSave} variant="contained" disabled={isError}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            {modelDef && (
                <InputVaporFitDialog
                    open={fittingOpen}
                    handleClose={handleCloseFitting}
                    compound={compound}
                    modelDef={modelDef}
                    params0={numData}
                    setFitResults={setFitResults}
                />
            )}
        </>
    );
};
