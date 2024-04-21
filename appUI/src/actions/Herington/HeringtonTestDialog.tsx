import { FC } from 'react';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { Box, DialogContent } from '@mui/material';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { HeringtonTestResponse, TestRequest } from '../../adapters/api/types/TDTestTypes.ts';
import { ConsistencyResult } from '../../components/AnalysisResults/ConsistencyResult.tsx';
import { sigDgtsCrit, sigDgtsDefault, toSigDgts } from '../../adapters/logic/numbers.ts';

type HeringtonTestDialogProps = DialogProps & { req: TestRequest; data: HeringtonTestResponse };

export const HeringtonTestDialog: FC<HeringtonTestDialogProps> = ({ open, handleClose, req, data }) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;
    const reasons = [`|D–J| ${data.is_consistent ? '<=' : '>'} ${toSigDgts(data.criterion, sigDgtsDefault)}`];

    return (
        <ResponsiveDialog maxWidth="md" fullWidth open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Herington test for {label}</DialogTitleWithX>
            <DialogContent>
                <ConsistencyResult warnings={data.warnings} is_consistent={data.is_consistent} reasons={reasons} />
                <Box m={2} pb={2}>
                    <table>
                        <tbody>
                            <tr>
                                <td width="70">D</td>
                                <td>{toSigDgts(data.D, sigDgtsDefault)}</td>
                            </tr>
                            <tr>
                                <td>J</td>
                                <td>{toSigDgts(data.J, sigDgtsDefault)}</td>
                            </tr>
                            <tr>
                                <td>|D–J|</td>
                                <td>{toSigDgts(data.DJ, sigDgtsDefault)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>|D–J| criterion is {toSigDgts(data.criterion, sigDgtsCrit)}</p>
                </Box>
            </DialogContent>
        </ResponsiveDialog>
    );
};
