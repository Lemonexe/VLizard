import { FC } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { QueryStats } from '@mui/icons-material';
import { useVaporAnalysisDialog } from '../../../actions/VaporAnalysis/useVaporAnalysisDialog.tsx';
import { CompoundIdentifier } from '../../../adapters/api/types/common.ts';

export const PerformAnalysisButton: FC<CompoundIdentifier> = (props) => {
    const { perform, result } = useVaporAnalysisDialog(props);
    return (
        <>
            <Tooltip title="Perform analysis">
                <IconButton children={<QueryStats />} onClick={perform} />
            </Tooltip>
            {result}
        </>
    );
};
