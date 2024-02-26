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
import { useNotifications } from '../../contexts/NotificationContext.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { ErrorLabel } from '../../components/dataViews/TooltipIcons.tsx';

import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { SystemIdentifier } from '../../adapters/api/types/common.ts';
import { PersistedFit } from '../../adapters/api/types/fitTypes.ts';
import { useFitAnalysis } from '../../adapters/api/useFit.ts';
import { ParamsSpreadsheet } from '../../components/ParamsSpreadsheet.tsx';

const commonInputStyle = { maxWidth: 300 };

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

    // TODO display warning if no param freedom, and if no datasets selected
    const isFreedom = modelDef && modelDef.param_names.length - const_param_names.length > 0;

    // SPREADSHEET
    const getInitialParams = (newModelName: string): number[] =>
        isEdit && newModelName === currentFit?.model_name
            ? Object.values(currentFit.results.result_params)
            : findModelDef(newModelName)?.params0 ?? [0];
    const getInitialData = (newModelName: string) => matrixToSpreadsheetData([getInitialParams(newModelName)]);
    const [data, setData] = useState<SpreadsheetData>(() => getInitialData(model_name));
    const isDataWhole = useMemo(() => checkIsSpreadsheetDataWhole(data), [data]);

    // MUTATION
    const pushNotification = useNotifications();
    const { mutate } = useFitAnalysis();
    const handleSave = useCallback(() => {
        const params0 = toNumMatrix(data)[0];
        mutate(
            { compound1, compound2, datasets, model_name, params0, const_param_names },
            {
                onSuccess: (res) => {
                    console.log(res);
                    pushNotification({ message: 'aaaaaaa!!!!', severity: 'success' });
                    handleClose();
                },
            },
        );
    }, [data, model_name]);

    // OVERALL ERROR CHECK
    const isError = !isFreedom || !isDataWhole || !datasets.length;

    return (
        <Dialog fullScreen open={open}>
            <DialogTitleWithX handleClose={handleClose}>
                {isEdit ? 'Alter the' : 'Perform new'} model fitting for {compound1}-{compound2}
            </DialogTitleWithX>
            <DialogContent>
                <Stack direction="column" gap={2} pt={1}>
                    <FormControl fullWidth>
                        <InputLabel id="datasets">Datasets</InputLabel>
                        <Select
                            multiple
                            labelId="datasets"
                            label="Datasets"
                            value={datasets}
                            onChange={(e) => setDatasets(e.target.value as string[])}
                            style={commonInputStyle}
                        >
                            {systemDatasets.map(({ name }) => (
                                <MenuItem key={name} value={name} children={name} />
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="model">Model type</InputLabel>
                        <Select
                            labelId="model"
                            label="Model type"
                            value={model_name}
                            onChange={(e) => {
                                setModel_name(e.target.value);
                                setData(getInitialData(e.target.value));
                            }}
                            style={commonInputStyle}
                        >
                            {VLEModelDefs!.map((v) => (
                                <MenuItem key={v.name} value={v.name} children={v.name} />
                            ))}
                        </Select>
                    </FormControl>
                    {modelDef && (
                        <FormControl fullWidth>
                            <InputLabel id="keepConstant">Params to keep constant</InputLabel>
                            <Select
                                multiple
                                labelId="keepConstant"
                                label="Params to keep constant"
                                value={const_param_names}
                                onChange={(e) => setConst_param_names(e.target.value as string[])}
                                style={commonInputStyle}
                            >
                                {modelDef.param_names.map((name) => (
                                    <MenuItem key={name} value={name} children={name} />
                                ))}
                            </Select>
                        </FormControl>
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
                    Perform
                </Button>
            </DialogActions>
        </Dialog>
    );
};
