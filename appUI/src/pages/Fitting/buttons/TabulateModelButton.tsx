import { FC, FormEvent, useState } from 'react';
import { Button, Dialog, DialogContent, IconButton, InputAdornment, Stack, TextField, Tooltip } from '@mui/material';
import { QueryStats } from '@mui/icons-material';
import { DialogTitleWithX } from '../../../components/Mui/DialogTitle.tsx';
import { SystemIdentifier } from '../../../adapters/api/types/common.ts';
import { PersistedFit } from '../../../adapters/api/types/fitTypes.ts';
import { useTabulateVLEFitDialog } from '../../../actions/TabulateVLEFit/useTabulateVLEFitDialog.tsx';
import { input_p } from '../../../adapters/logic/UoM.ts';
import { useConfig } from '../../../contexts/ConfigContext.tsx';

type TabulateModelButtonProps = SystemIdentifier & { fit: PersistedFit };

export const TabulateModelButton: FC<TabulateModelButtonProps> = ({ compound1, compound2, fit }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { UoM_p } = useConfig();
    const [raw_p, setRaw_p] = useState('');
    const isInvalid_p = isNaN(parseFloat(raw_p));

    const { perform, result } = useTabulateVLEFitDialog();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const processed_p = input_p(parseFloat(raw_p), UoM_p);
        perform({ compound1, compound2, model_name: fit.model_name, p: processed_p });
        handleClose();
    };

    return (
        <>
            <Tooltip title="Tabulate at specified pressure">
                <IconButton children={<QueryStats />} onClick={handleOpen} />
            </Tooltip>

            <Dialog open={open} onClose={handleClose} maxWidth="xs">
                <DialogTitleWithX handleClose={handleClose}>Tabulate at pressure</DialogTitleWithX>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Stack direction="row" gap={1}>
                            <TextField
                                value={raw_p}
                                onChange={(e) => setRaw_p(e.target.value)}
                                size="small"
                                className="num-input"
                                slotProps={{
                                    input: { endAdornment: <InputAdornment position="end">{UoM_p}</InputAdornment> },
                                }}
                            />
                            <Button type="submit" variant="outlined" disabled={isInvalid_p}>
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
