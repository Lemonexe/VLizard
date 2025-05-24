import { Button } from '@mui/material';
import { FC } from 'react';

import { useHeringtonTestDialog } from '../../../../actions/Herington/useHeringtonTestDialog.tsx';
import { DatasetIdentifier } from '../../../../adapters/api/types/common.ts';

export const HeringtonTestButton: FC<DatasetIdentifier> = (props) => {
    const { perform, result } = useHeringtonTestDialog(props);
    return (
        <>
            <Button variant="outlined" onClick={perform}>
                Herington test
            </Button>
            {result}
        </>
    );
};
