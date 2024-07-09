import { FC } from 'react';
import { Button } from '@mui/material';
import { DatasetIdentifier } from '../../../../adapters/api/types/common.ts';
import { useGammaTestDialog } from '../../../../actions/Gamma/useGammaTestDialog.tsx';

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
