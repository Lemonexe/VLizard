import { FC } from 'react';
import { TestDialogProps } from '../types.ts';
import { Dialog, DialogContent } from '@mui/material';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { RKTestResponse } from '../../adapters/api/types/TDTestTypes.ts';
import { AnalysisWarnings } from '../../components/AnalysisWarnings.tsx';

type RKTestDialogProps = TestDialogProps & { data: RKTestResponse };

export const RKTestDialog: FC<RKTestDialogProps> = ({ open, handleClose, data, label }) => {
    return (
        <Dialog fullScreen open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Redlich-Kister test for {label}</DialogTitleWithX>
            <DialogContent>
                <AnalysisWarnings warnings={data.warnings} />
                Redlich-Kister test {Boolean(data)}
            </DialogContent>
        </Dialog>
    );
};
