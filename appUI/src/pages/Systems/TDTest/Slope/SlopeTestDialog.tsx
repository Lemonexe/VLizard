import { FC } from 'react';
import { TestDialogProps } from '../TestDialogProps.ts';
import { Dialog, DialogContent } from '@mui/material';
import { DialogTitleWithX } from '../../../../components/Mui/DialogTitle.tsx';

export const SlopeTestDialog: FC<TestDialogProps> = ({ open, handleClose, compound1, compound2, dataset }) => {
    return (
        <Dialog fullScreen open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>
                Slope test for {compound1}-{compound2} {dataset}
            </DialogTitleWithX>
            <DialogContent>Slope test</DialogContent>
        </Dialog>
    );
};
