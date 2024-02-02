import { FC } from 'react';
import { TestDialogProps } from '../types.ts';
import { Dialog, DialogContent } from '@mui/material';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { HeringtonTestResponse } from '../../adapters/api/types/TDTestTypes.ts';

type HeringtonTestDialogProps = TestDialogProps & { data: HeringtonTestResponse };

export const HeringtonTestDialog: FC<HeringtonTestDialogProps> = ({ open, handleClose, data, label }) => {
    return (
        <Dialog fullScreen open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Herington test for {label}</DialogTitleWithX>
            <DialogContent>Herington test {Boolean(data)}</DialogContent>
        </Dialog>
    );
};
