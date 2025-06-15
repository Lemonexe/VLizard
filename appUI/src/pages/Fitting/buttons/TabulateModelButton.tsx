import { QueryStats } from '@mui/icons-material';
import { Button, Dialog, DialogContent, IconButton, InputAdornment, Stack, TextField, Tooltip } from '@mui/material';
import { ChangeEvent, FC, FormEvent, useState } from 'react';

import { useTabulateVLEFitDialog } from '../../../actions/TabulateVLEFit/useTabulateVLEFitDialog.tsx';
import { SystemIdentifier } from '../../../adapters/api/types/common.ts';
import { PersistedFit } from '../../../adapters/api/types/fitTypes.ts';
import { input_T, input_p } from '../../../adapters/logic/UoM.ts';
import { DialogTitleWithX } from '../../../components/Mui/DialogTitle.tsx';
import { useConfig } from '../../../contexts/ConfigContext.tsx';

type TabulateModelButtonProps = SystemIdentifier & { fit: PersistedFit };

export const TabulateModelButton: FC<TabulateModelButtonProps> = ({ compound1, compound2, fit }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { UoM_p, UoM_T } = useConfig();
    const [raw_p, setRaw_p] = useState('');
    const [raw_T, setRaw_T] = useState('');
    const isInvalid_p = isNaN(parseFloat(raw_p));
    const isInvalid_T = isNaN(parseFloat(raw_T));
    const isDisabled = isInvalid_p === isInvalid_T; // xor is allowed, equivalence is disabled

    const { perform, result } = useTabulateVLEFitDialog();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const model_name = fit.model_name;
        const p_spec = raw_p === '' ? undefined : input_p(parseFloat(raw_p), UoM_p);
        const T_spec = raw_T === '' ? undefined : input_T(parseFloat(raw_T), UoM_T);
        perform({ compound1, compound2, model_name, p_spec, T_spec });
        handleClose();
    };

    const handleChange_p = (e: ChangeEvent<HTMLInputElement>) => {
        setRaw_p(e.target.value);
        setRaw_T('');
    };
    const handleChange_T = (e: ChangeEvent<HTMLInputElement>) => {
        setRaw_T(e.target.value);
        setRaw_p('');
    };

    return (
        <>
            <Tooltip title="Tabulate at specified p / T">
                <IconButton children={<QueryStats />} onClick={handleOpen} />
            </Tooltip>

            <Dialog open={open} onClose={handleClose} maxWidth="sm">
                <DialogTitleWithX handleClose={handleClose}>
                    Tabulate at pressure <i>or</i> temperature
                </DialogTitleWithX>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Stack direction="row" gap={1}>
                            <TextField
                                value={raw_p}
                                onChange={handleChange_p}
                                size="small"
                                className="num-input"
                                slotProps={{
                                    input: { endAdornment: <InputAdornment position="end">{UoM_p}</InputAdornment> },
                                }}
                            />
                            <TextField
                                value={raw_T}
                                onChange={handleChange_T}
                                size="small"
                                className="num-input"
                                slotProps={{
                                    input: { endAdornment: <InputAdornment position="end">{UoM_T}</InputAdornment> },
                                }}
                            />
                            <Button type="submit" variant="outlined" disabled={isDisabled}>
                                Run
                            </Button>
                        </Stack>
                    </form>
                </DialogContent>
            </Dialog>

            {result}
        </>
    );
};
