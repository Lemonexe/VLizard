import { FC, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { PostAdd } from '@mui/icons-material';
import { SystemIdentifier } from '../../../adapters/api/types/common.ts';
import { useFitVLEResultsDialog } from '../../../actions/FitVLE/useFitVLEResultsDialog.tsx';
import { SpecifyFitDialog } from '../SpecifyFitDialog.tsx';

type PerformFitButtonProps = SystemIdentifier & { disabled: boolean };

export const PerformFitButton: FC<PerformFitButtonProps> = ({ compound1, compound2, disabled }) => {
    const [open, setOpen] = useState(false);
    const { perform, result } = useFitVLEResultsDialog();

    return (
        <>
            <Tooltip title={disabled ? 'Incomplete data' : 'Perform new model fitting'}>
                <span>
                    <IconButton children={<PostAdd />} onClick={() => setOpen(true)} disabled={disabled} />
                </span>
            </Tooltip>
            {open && (
                <SpecifyFitDialog
                    open={open}
                    handleClose={() => setOpen(false)}
                    compound1={compound1}
                    compound2={compound2}
                    performFitVLE={perform}
                />
            )}
            {result}
        </>
    );
};
