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
} from '@mui/material';
import { useData } from '../../contexts/DataContext.tsx';
import {
    checkIsSpreadsheetDataWhole,
    matrixToSpreadsheetData,
    SpreadsheetData,
    toNumMatrix,
} from '../../adapters/logic/spreadsheet.ts';
import { fromNamedParams, toNamedParams } from '../../adapters/logic/nparams.ts';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { ErrorLabel, InfoLabel } from '../../components/dataViews/TooltipIcons.tsx';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { SystemIdentifier } from '../../adapters/api/types/common.ts';
import { PersistedFit } from '../../adapters/api/types/fitTypes.ts';
import { ParamsSpreadsheet } from '../../components/ParamsSpreadsheet.tsx';
import { useFitResultsDialog } from '../../actions/Fit/useFitResultsDialog.tsx';

type UpsertDatasetDialogProps = DialogProps &
    SystemIdentifier & {
        // defined for Alter fit, undefined for Perform fit
        currentFit?: PersistedFit;
    };

export const SpecifyFitDialog: FC<UpsertDatasetDialogProps> = ({
    compound1,
    compound2,
    currentFit,
    open,
    handleClose,
}) => {
    const isEdit = Boolean(currentFit);

    // systemNames & VLEModelDefs are guaranteed, see FittedModelsTable.tsx
    const { VLEModelDefs, VLEData } = useData();
    const system_name = `${compound1}-${compound2}`;
    const systemDatasets = VLEData!.filter((system) => system.system_name === system_name)[0].datasets;

    const [model_name, setModel_name] = useState(() => currentFit?.model_name ?? '');
    const [datasets, setDatasets] = useState(currentFit?.input.datasets ?? []);
    const [const_param_names, setConst_param_names] = useState(currentFit?.input.const_param_names ?? []);

    const findModelDef = (modelName: string) => VLEModelDefs!.find((vd) => vd.name === modelName);
    const modelDef = useMemo(() => findModelDef(model_name), [model_name]);

    const paramNames = modelDef ? fromNamedParams(modelDef.nparams0)[0] : [];
    const isFreedom = modelDef && paramNames.length - const_param_names.length > 0;

    // SPREADSHEET
    const getInitialParams = (newModelName: string): number[] =>
        isEdit && newModelName === currentFit?.model_name
            ? fromNamedParams(currentFit.results.nparams)[1]
            : fromNamedParams(findModelDef(newModelName)?.nparams0)[1];
    const getInitialData = (newModelName: string) => matrixToSpreadsheetData([getInitialParams(newModelName)]);
    const [data, setData] = useState<SpreadsheetData>(() => getInitialData(model_name));
    const isDataWhole = useMemo(() => checkIsSpreadsheetDataWhole(data), [data]);

    // GET RESULTS DIALOG
    const { perform, result } = useFitResultsDialog();
    const handleSave = useCallback(() => {
        const params0 = toNumMatrix(data)[0];
        const nparams0 = toNamedParams(paramNames, params0);
        const skip_optimization = !isFreedom;
        perform({ compound1, compound2, datasets, model_name, nparams0, const_param_names, skip_optimization });
        handleClose();
    }, [data, compound1, compound2, datasets, model_name, paramNames, const_param_names, perform]);

    // OVERALL ERROR CHECK
    const isError = !isDataWhole || !datasets.length;

    return (
        <>
            <Dialog fullScreen open={open}>
                <DialogTitleWithX handleClose={handleClose}>
                    {isEdit ? 'Alter the' : 'Perform new'} model fitting for {compound1}-{compound2}
                </DialogTitleWithX>
                <DialogContent>
                    <Stack direction="column" gap={2} pt={1}>
                        <Stack direction="row" gap={1} alignItems="center">
                            <FormControl fullWidth className="medium-input">
                                <InputLabel id="datasets">Datasets</InputLabel>
                                <Select
                                    multiple
                                    labelId="datasets"
                                    label="Datasets"
                                    value={datasets}
                                    onChange={(e) => setDatasets(e.target.value as string[])}
                                >
                                    {systemDatasets.map(({ name }) => (
                                        <MenuItem key={name} value={name} children={name} />
                                    ))}
                                </Select>
                            </FormControl>
                            {datasets.length === 0 && <ErrorLabel title="No datasets selected!" />}
                        </Stack>
                        <FormControl fullWidth className="medium-input">
                            <InputLabel id="model">Model type</InputLabel>
                            <Select
                                labelId="model"
                                label="Model type"
                                value={model_name}
                                onChange={(e) => {
                                    setModel_name(e.target.value);
                                    setData(getInitialData(e.target.value));
                                    setConst_param_names([]);
                                }}
                            >
                                {VLEModelDefs!.map((v) => (
                                    <MenuItem key={v.name} value={v.name} children={v.name} />
                                ))}
                            </Select>
                        </FormControl>
                        {modelDef && (
                            <Stack direction="row" gap={1} alignItems="center">
                                <FormControl fullWidth className="medium-input">
                                    <InputLabel id="keepConstant">Params to keep constant</InputLabel>
                                    <Select
                                        multiple
                                        labelId="keepConstant"
                                        label="Params to keep constant"
                                        value={const_param_names}
                                        onChange={(e) => setConst_param_names(e.target.value as string[])}
                                    >
                                        {paramNames.map((name) => (
                                            <MenuItem key={name} value={name} children={name} />
                                        ))}
                                    </Select>
                                </FormControl>
                                {!isFreedom && <InfoLabel title="No params left to optimize." />}
                            </Stack>
                        )}
                    </Stack>
                    {modelDef && (
                        <Box pt={3}>
                            <p>
                                <strong>Model parameters</strong>
                            </p>
                            <ParamsSpreadsheet data={data} setData={setData} model_param_names={paramNames} />
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
                        Optimize & Save
                    </Button>
                </DialogActions>
            </Dialog>
            {result}
        </>
    );
};
