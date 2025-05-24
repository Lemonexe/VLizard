import { Button } from '@mui/material';
import { FC } from 'react';

import { useGammaTestDialog } from '../../../../actions/Gamma/useGammaTestDialog.tsx';
import { DatasetIdentifier } from '../../../../adapters/api/types/common.ts';

export const GammaTestButton: FC<DatasetIdentifier> = (props) => {
    const { perform, result } = useGammaTestDialog(props);
    return (
        <>
            <Button variant="contained" onClick={perform}>
                Gamma offset test
            </Button>
            {result}
        </>
    );
};
