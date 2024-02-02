import { FC } from 'react';
import { TestDialogProps } from '../types.ts';
import { Dialog, DialogContent } from '@mui/material';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { GammaTestResponse } from '../../adapters/api/types/TDTestTypes.ts';

type GammaTestDialogProps = TestDialogProps & { data: GammaTestResponse };

export const GammaTestDialog: FC<GammaTestDialogProps> = ({ open, handleClose, data, label }) => {
    return (
        <Dialog fullScreen open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Gamma test for {label}</DialogTitleWithX>
            <DialogContent>Gamma test {Boolean(data)}</DialogContent>
        </Dialog>
    );
};
