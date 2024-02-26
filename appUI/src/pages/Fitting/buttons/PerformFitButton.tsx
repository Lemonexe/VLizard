import { FC, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { PostAdd } from '@mui/icons-material';
import { SystemIdentifier } from '../../../adapters/api/types/common.ts';

type PerformFitButtonProps = SystemIdentifier & { disabled: boolean };

export const PerformFitButton: FC<PerformFitButtonProps> = ({ compound1, compound2, disabled }) => {
    const [open, setOpen] = useState(false);
    console.log(open, compound1, compound2);
    return (
        <>
            <Tooltip title="Perform new model fitting">
                <IconButton children={<PostAdd />} onClick={() => setOpen(true)} disabled={disabled} />
            </Tooltip>
        </>
    );
};
