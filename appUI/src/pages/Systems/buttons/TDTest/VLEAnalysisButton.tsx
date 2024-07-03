import { FC } from 'react';
import { Button } from '@mui/material';
import { DatasetIdentifier } from '../../../../adapters/api/types/common.ts';
import { useVLEAnalysisDialog } from '../../../../actions/VLEAnalysis/useVLEAnalysisDialog.tsx';

export const VLEAnalysisButton: FC<DatasetIdentifier> = (props) => {
    const { perform, result } = useVLEAnalysisDialog(props);
    return (
        <>
            <Button variant="contained" onClick={perform}>
                Visualize data
            </Button>
            {result}
        </>
    );
};
