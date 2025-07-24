import { Button, Checkbox, Stack, TextField } from '@mui/material';
import { FC, FormEvent, useState } from 'react';

import { useGammaTestDialog } from '../../../../actions/Gamma/useGammaTestDialog.tsx';
import { DatasetIdentifier } from '../../../../adapters/api/types/common.ts';

export const GammaTestButton: FC<DatasetIdentifier> = (props) => {
    const [do_virial, set_do_virial] = useState(false);
    const [c_12, set_c_12] = useState<number | undefined>(undefined);
    const { perform, result } = useGammaTestDialog({ ...props, do_virial, c_12 });
    const [nextStep, setNextStep] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setNextStep(false);
        perform();
    };

    const form = !nextStep ? (
        <Button variant="contained" onClick={() => setNextStep(true)}>
            Gamma offset test
        </Button>
    ) : (
        <form onSubmit={handleSubmit}>
            <Stack direction="column" gap={1}>
                <label>
                    Use virial equation:
                    <Checkbox checked={do_virial} onChange={(e) => set_do_virial(e.target.checked)} />
                </label>
                <Stack direction="row" gap={1}>
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
            </Stack>
        </form>
    );

    return (
        <>
            {form}
            {result}
        </>
    );
};
