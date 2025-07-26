import { Button, Checkbox, Stack, TextField } from '@mui/material';
import { FC, FormEvent, useMemo, useState } from 'react';

import { useGammaTestDialog } from '../../../../actions/Gamma/useGammaTestDialog.tsx';
import { DatasetIdentifier } from '../../../../adapters/api/types/common.ts';
import { DialogProps } from '../../../../adapters/types/DialogProps.ts';
import { ResponsiveDialog } from '../../../../components/Mui/ResponsiveDialog.tsx';

type GammaTestRequestDialog = DialogProps & { requestProps: DatasetIdentifier };

const GammaTestRequestDialog = ({ requestProps, open, handleClose }: GammaTestRequestDialog) => {
    const [do_virial, set_do_virial] = useState(false);
    const const_param_names = useMemo(
        () => ['c_12', ...(do_virial ? ['virB_1', 'virB_12', 'virB_2'] : [])],
        [do_virial],
    );
    const [c_12, set_c_12] = useState<number | undefined>(undefined);
    const { perform, result } = useGammaTestDialog({ ...requestProps, const_param_names, c_12 });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        perform();
    };

    return (
        <>
            {result}
            <ResponsiveDialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <Stack direction="column" gap={1}>
                        <label>
                            Use virial equation:
                            <Checkbox checked={do_virial} onChange={(e) => set_do_virial(e.target.checked)} />
                        </label>

                        <label>
                            <TextField
                                type="number"
                                size="small"
                                label={
                                    <>
                                        c<sub>12</sub>
                                    </>
                                }
                                slotProps={{ htmlInput: { step: 0.05 } }}
                                value={c_12 ?? ''}
                                onChange={(e) => set_c_12(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                        </label>

                        <Button type="submit" variant="contained">
                            Run
                        </Button>
                    </Stack>
                </form>
            </ResponsiveDialog>
        </>
    );
};

export const GammaTestButton: FC<DatasetIdentifier> = (requestProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                Gamma offset test
            </Button>
            <GammaTestRequestDialog requestProps={requestProps} open={open} handleClose={() => setOpen(false)} />
        </>
    );
};
