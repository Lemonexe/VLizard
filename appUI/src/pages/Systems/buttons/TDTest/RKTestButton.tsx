import { Button } from '@mui/material';
import { FC } from 'react';

import { useRKTestDialog } from '../../../../actions/RK/useRKTestDialog.tsx';
import { DatasetIdentifier } from '../../../../adapters/api/types/common.ts';

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
