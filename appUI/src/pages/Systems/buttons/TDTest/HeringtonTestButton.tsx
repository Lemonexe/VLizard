import { FC } from 'react';
import { Button } from '@mui/material';
import { DatasetIdentifier } from '../../../../adapters/api/types/common.ts';
import { useHeringtonTestDialog } from '../../../../actions/Herington/useHeringtonTestDialog.tsx';

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
