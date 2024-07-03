import { FC } from 'react';
import { Button } from '@mui/material';
import { DatasetIdentifier } from '../../../../adapters/api/types/common.ts';
import { useRKTestDialog } from '../../../../actions/RK/useRKTestDialog.tsx';

export const RKTestButton: FC<DatasetIdentifier> = (props) => {
    const { perform, result } = useRKTestDialog(props);
    return (
        <>
            <Button variant="contained" onClick={perform}>
                Redlich-Kister test
            </Button>
            {result}
        </>
    );
};
