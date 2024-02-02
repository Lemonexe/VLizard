import { FC } from 'react';
import { TestDialogProps } from '../types.ts';
import { Dialog, DialogContent } from '@mui/material';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';

export const HeringtonTestDialog: FC<TestDialogProps> = ({ open, handleClose, compound1, compound2, dataset }) => {
    return (
        <Dialog fullScreen open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>
                Herington test for {compound1}-{compound2} {dataset}
            </DialogTitleWithX>
            <DialogContent>Herington test</DialogContent>
        </Dialog>
    );
};
