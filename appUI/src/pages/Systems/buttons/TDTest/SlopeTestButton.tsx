import { FC } from 'react';
import { Button } from '@mui/material';
import { DatasetIdentifier } from '../../../../adapters/api/types/common.ts';
import { useSlopeTestDialog } from '../../../../actions/Slope/useSlopeTestDialog.tsx';

export const SlopeTestButton: FC<DatasetIdentifier> = (props) => {
    const { perform, result } = useSlopeTestDialog(props);
    return (
        <>
            <Button variant="contained" onClick={perform}>
                Slope test
            </Button>
            {result}
        </>
    );
};
