import { Button } from '@mui/material';
import { FC } from 'react';

import { useSlopeTestDialog } from '../../../../actions/Slope/useSlopeTestDialog.tsx';
import { DatasetIdentifier } from '../../../../adapters/api/types/common.ts';

export const SlopeTestButton: FC<DatasetIdentifier> = (props) => {
    const { perform, result } = useSlopeTestDialog(props);
    return (
        <>
            <Button variant="outlined" onClick={perform}>
                Slope test
            </Button>
            {result}
        </>
    );
};
