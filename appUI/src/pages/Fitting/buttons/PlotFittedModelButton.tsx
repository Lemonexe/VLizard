import { FC, useCallback, useState } from 'react';
import { Button, Dialog, DialogContent, IconButton, InputAdornment, Stack, TextField, Tooltip } from '@mui/material';
import { QueryStats } from '@mui/icons-material';
import { DialogTitleWithX } from '../../../components/Mui/DialogTitle.tsx';
import { SystemIdentifier } from '../../../adapters/api/types/common.ts';
import { PersistedFit } from '../../../adapters/api/types/fitTypes.ts';
import { useFitVLEResultsDialog } from '../../../actions/FitVLE/useFitVLEResultsDialog.tsx';
import { useTabulateVLEFitDialog } from '../../../actions/TabulateVLEFit/useTabulateVLEFitDialog.tsx';
import { input_p } from '../../../adapters/logic/UoM.ts';
import { useConfig } from '../../../contexts/ConfigContext.tsx';

type PlotFittedModelButtonProps = SystemIdentifier & { fit: PersistedFit };

export const PlotFittedModelButton: FC<PlotFittedModelButtonProps> = ({ compound1, compound2, fit }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = useCallback(() => setOpen(true), []);
    const handleClose = useCallback(() => setOpen(false), []);

    const { UoM_p } = useConfig();
    const [raw_p, setRaw_p] = useState('');
    const isInvalid_p = isNaN(parseFloat(raw_p));

    const actionExisting = useFitVLEResultsDialog();
    const actionSpecified = useTabulateVLEFitDialog();

    const tabulateExisting = useCallback(() => {
        actionExisting.perform({
            compound1,
            compound2,
            datasets: fit.input.datasets,
            model_name: fit.model_name,
            nparams0: fit.results.nparams,
            const_param_names: fit.input.const_param_names,
            skip_optimization: true,
        });
        handleClose();
    }, [actionExisting.perform, compound1, compound2, fit]);

    const tabulateSpecified = useCallback(() => {
        const processed_p = input_p(parseFloat(raw_p), UoM_p);
        actionSpecified.perform({ compound1, compound2, model_name: fit.model_name, p: processed_p });
        handleClose();
    }, [actionSpecified.perform, fit.model_name, raw_p, UoM_p]);

    return (
        <>
            <Tooltip title="Tabulate & visualise fit">
                <IconButton children={<QueryStats />} onClick={handleOpen} />
            </Tooltip>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitleWithX handleClose={handleClose}>Tabulate either:</DialogTitleWithX>
                <DialogContent>
                    <Button variant="outlined" onClick={tabulateExisting}>
                        Fitting of all data
                    </Button>

                    <p>or</p>

                    <form onSubmit={tabulateSpecified}>
                        <Stack direction="row" gap={1}>
                            <TextField
                                value={raw_p}
                                onChange={(e) => setRaw_p(e.target.value)}
                                size="small"
                                className="num-input"
                                InputProps={{ endAdornment: <InputAdornment position="end">{UoM_p}</InputAdornment> }}
                            />
                            <Button variant="outlined" onClick={tabulateSpecified} disabled={isInvalid_p}>
                                At specified pressure
                            </Button>
                        </Stack>
                    </form>
                </DialogContent>
            </Dialog>
            {actionExisting.result}
            {actionSpecified.result}
        </>
    );
};
