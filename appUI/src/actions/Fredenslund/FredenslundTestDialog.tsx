import { FC } from 'react';
import { TestDialogProps } from '../types.ts';
import { Dialog, DialogContent } from '@mui/material';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { FredenslundTestResponse } from '../../adapters/api/types/TDTestTypes.ts';
import { AnalysisWarnings } from '../../components/AnalysisWarnings.tsx';

type FredenslundTestDialogProps = TestDialogProps & { data: FredenslundTestResponse };

export const FredenslundTestDialog: FC<FredenslundTestDialogProps> = ({ open, handleClose, data, label }) => {
    return (
        <Dialog fullScreen open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Fredenslund test for {label}</DialogTitleWithX>
            <DialogContent>
                <AnalysisWarnings warnings={data.warnings} />
                Fredenslund test {Boolean(data)}
            </DialogContent>
        </Dialog>
    );
};
