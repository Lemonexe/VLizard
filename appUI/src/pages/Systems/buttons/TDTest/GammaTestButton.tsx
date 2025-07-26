import { Button, Checkbox, Dialog, DialogActions, DialogContent, Stack, TextField } from '@mui/material';
import { FC, FormEvent, useMemo, useState } from 'react';

import { useGammaTestDialog } from '../../../../actions/Gamma/useGammaTestDialog.tsx';
import { DatasetIdentifier } from '../../../../adapters/api/types/common.ts';
import { DialogProps } from '../../../../adapters/types/DialogProps.ts';
import { DialogTitleWithX } from '../../../../components/Mui/DialogTitle.tsx';
import { useData } from '../../../../contexts/DataContext.tsx';

const c_12InputStep = 0.01;

type GammaTestRequestDialog = DialogProps & { req: DatasetIdentifier };

const GammaTestRequestDialog = ({ req, open, handleClose }: GammaTestRequestDialog) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;
    const [doVirial, setDoVirial] = useState(false);
    const { findVLEModelByName } = useData();
    const getDefault_c12 = () => findVLEModelByName('NRTL')?.nparams0.c_12;

    const [c_12, set_c_12] = useState<number | undefined>(getDefault_c12);

    const const_param_names = useMemo(() => {
        const names = ['c_12']; // always excluded from optimization
        if (!doVirial) names.push('virB_1', 'virB_12', 'virB_2'); // exclude virial parameters if not enabled
        return names;
    }, [doVirial]);

    const { perform, result } = useGammaTestDialog({ ...req, const_param_names, c_12 });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        perform();
    };

    return (
        <>
            {result}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <form onSubmit={handleSubmit}>
                    <DialogTitleWithX handleClose={handleClose}>Gamma offset test for {label}</DialogTitleWithX>
                    <DialogContent>
                        <Stack direction="column" gap={1}>
                            <label>
                                Use virial equation:
                                <Checkbox checked={doVirial} onChange={(e) => setDoVirial(e.target.checked)} />
                            </label>

                            <label>
                                <TextField
                                    type="number"
                                    size="small"
                                    label={
                                        <>
                                            NRTL C<sub>12</sub>
                                        </>
                                    }
                                    slotProps={{ htmlInput: { step: c_12InputStep } }}
                                    value={c_12 ?? ''}
                                    onChange={(e) => set_c_12(e.target.value ? parseFloat(e.target.value) : undefined)}
                                />
                            </label>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" variant="contained">
                            Run
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export const GammaTestButton: FC<DatasetIdentifier> = (reqProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                Gamma offset test
            </Button>
            <GammaTestRequestDialog req={reqProps} open={open} handleClose={() => setOpen(false)} />
        </>
    );
};
