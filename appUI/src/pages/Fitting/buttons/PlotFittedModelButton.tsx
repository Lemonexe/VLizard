import { FC, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { QueryStats } from '@mui/icons-material';
import { SystemIdentifier } from '../../../adapters/api/types/common.ts';

type PlotFittedModelButtonProps = SystemIdentifier & { model_name: string };

export const PlotFittedModelButton: FC<PlotFittedModelButtonProps> = ({ compound1, compound2, model_name }) => {
    const [open, setOpen] = useState(false);
    console.log(open, compound1, compound2, model_name);
    return (
        <>
            <Tooltip title="Tabulate & visualise fit">
                <IconButton children={<QueryStats />} onClick={() => setOpen(true)} />
            </Tooltip>
        </>
    );
};
