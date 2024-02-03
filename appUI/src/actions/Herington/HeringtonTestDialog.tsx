import { FC } from 'react';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { Box, Dialog, DialogContent } from '@mui/material';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { HeringtonTestResponse, TestRequest } from '../../adapters/api/types/TDTestTypes.ts';
import { ConsistencyResult } from '../../components/AnalysisResults/ConsistencyResult.tsx';
import { toSigDgts } from '../../adapters/logic/numbers.ts';

type HeringtonTestDialogProps = DialogProps & { req: TestRequest; data: HeringtonTestResponse };

export const HeringtonTestDialog: FC<HeringtonTestDialogProps> = ({ open, handleClose, req, data }) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;
    const reasons = [`|D–J| ${data.is_consistent ? '<=' : '>'} ${toSigDgts(data.criterion, 3)}`];

    return (
        <Dialog fullScreen open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Herington test for {label}</DialogTitleWithX>
            <DialogContent>
                <ConsistencyResult warnings={data.warnings} is_consistent={data.is_consistent} reasons={reasons} />
                <Box m={2}>
                    <code>D = {toSigDgts(data.D, 3)}</code>
                    <br />
                    <code>J = {toSigDgts(data.J, 3)}</code>
                    <br />
                    <code>|D–J| = {toSigDgts(data.DJ, 3)}</code>
                    <br />
                    <br />
                    <code>|D–J| criterion = {toSigDgts(data.criterion, 3)}</code>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
