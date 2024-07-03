import { FC, useCallback, useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { DatasetIdentifier } from '../../../../adapters/api/types/common.ts';
import { useConfig } from '../../../../contexts/ConfigContext.tsx';
import { useFredenslundTestDialog } from '../../../../actions/Fredenslund/useFredenslundTestDialog.tsx';

export const FredenslundTestButton: FC<DatasetIdentifier> = (props) => {
    const { default_legendre_order } = useConfig();
    const [legendre_order, setLegendre_order] = useState(default_legendre_order);
    const { perform, result } = useFredenslundTestDialog({ ...props, legendre_order });
    const [nextStep, setNextStep] = useState(false);
    const sendAndReset = useCallback(() => {
        setNextStep(false);
        perform();
    }, [perform]);

    const form = !nextStep ? (
        <Button variant="contained" onClick={() => setNextStep(true)}>
            Fredenslund test
        </Button>
    ) : (
        <form onSubmit={sendAndReset}>
            <Stack direction="row" gap={1}>
                <TextField
                    type="number"
                    label="Legendre polynomial order"
                    value={legendre_order}
                    onChange={(e) => setLegendre_order(parseInt(e.target.value))}
                    inputProps={{ min: 3, max: 5 }}
                    size="small"
                    autoFocus
                    fullWidth
                />
                <Button variant="contained" onClick={sendAndReset}>
                    Run
                </Button>
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
