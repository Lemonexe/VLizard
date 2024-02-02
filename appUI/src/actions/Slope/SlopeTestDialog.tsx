import { FC } from 'react';
import { TestDialogProps } from '../types.ts';
import { Dialog, DialogContent } from '@mui/material';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { SlopeTestResponse } from '../../adapters/api/types/TDTestTypes.ts';
import { AnalysisWarnings } from '../../components/AnalysisWarnings.tsx';

type SlopeTestDialogProps = TestDialogProps & { data: SlopeTestResponse };

export const SlopeTestDialog: FC<SlopeTestDialogProps> = ({ open, handleClose, data, label }) => {
    return (
        <Dialog fullScreen open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Slope test for {label}</DialogTitleWithX>
            <DialogContent>
                <AnalysisWarnings warnings={data.warnings} />
                Slope test {Boolean(data)}
            </DialogContent>
        </Dialog>
    );
};
