import { FC, useCallback } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { AutoGraph } from '@mui/icons-material';
import { SystemIdentifier } from '../../../adapters/api/types/common.ts';
import { PersistedFit } from '../../../adapters/api/types/fitTypes.ts';
import { useFitVLEResultsDialog } from '../../../actions/FitVLE/useFitVLEResultsDialog.tsx';

type PlotFittedModelButtonProps = SystemIdentifier & { fit: PersistedFit };

export const PlotFittedModelButton: FC<PlotFittedModelButtonProps> = ({ compound1, compound2, fit }) => {
    const { perform, result } = useFitVLEResultsDialog();

    const handleSubmit = useCallback(() => {
        perform({
            compound1,
            compound2,
            datasets: fit.input.datasets,
            model_name: fit.model_name,
            nparams0: fit.results.nparams,
            const_param_names: fit.input.const_param_names,
            skip_optimization: true,
        });
    }, [perform, compound1, compound2, fit]);

    return (
        <>
            <Tooltip title="Tabulate fit">
                <IconButton children={<AutoGraph />} onClick={handleSubmit} />
            </Tooltip>
            {result}
        </>
    );
};
