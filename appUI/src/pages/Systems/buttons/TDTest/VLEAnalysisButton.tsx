import { FC } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import { AutoGraph } from '@mui/icons-material';
import { DatasetIdentifier } from '../../../../adapters/api/types/common.ts';
import { useVLEAnalysisDialog } from '../../../../actions/VLEAnalysis/useVLEAnalysisDialog.tsx';

export const VLEAnalysisButton: FC<DatasetIdentifier> = (props) => {
    const { perform, result } = useVLEAnalysisDialog(props);
    return (
        <>
            <Button variant="contained" onClick={perform} startIcon={<AutoGraph />}>
                Visualize data
            </Button>
            {result}
        </>
    );
};

export const VLEAnalysisIconButton: FC<DatasetIdentifier> = (props) => {
    const { perform, result } = useVLEAnalysisDialog(props);
    return (
        <>
            <Tooltip title="Visualize data">
                <IconButton children={<AutoGraph />} onClick={perform} />
            </Tooltip>
            {result}
        </>
    );
};
