import { FC } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { VaporAnalysisResponse } from '../../adapters/api/types/vapor.ts';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { VaporAnalysisDialogResults } from './VaporAnalysisDialogResults.tsx';

type VaporAnalysisDialogProps = { data: VaporAnalysisResponse | null; open: boolean; handleClose: () => void };

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
