import { FC } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { VaporAnalysisResponse } from '../../adapters/api/types/vapor.ts';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { VaporAnalysisDialogResults } from './VaporAnalysisDialogResults.tsx';
import { DialogProps } from '../../adapters/types/DialogProps.ts';

type VaporAnalysisDialogProps = DialogProps & { data: VaporAnalysisResponse | null };

export const VaporAnalysisDialog: FC<VaporAnalysisDialogProps> = ({ data, open, handleClose }) => {
    if (!data) return null;

    return (
        <Dialog fullScreen open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Vapor pressure analysis for {data.compound}</DialogTitleWithX>
            <DialogContent>
                <VaporAnalysisDialogResults data={data} />
            </DialogContent>
        </Dialog>
    );
};
