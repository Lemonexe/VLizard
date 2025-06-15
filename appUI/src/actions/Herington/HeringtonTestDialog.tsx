import { Alert, Box, DialogContent } from '@mui/material';
import { FC } from 'react';

import { HeringtonTestResponse, TestRequest } from '../../adapters/api/types/TDTestTypes.ts';
import { sigDgtsCrit, toSigDgts } from '../../adapters/logic/numbers.ts';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { ConsistencyResult } from '../../components/AnalysisResults/ConsistencyResult.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { useConfig } from '../../contexts/ConfigContext.tsx';

type HeringtonTestDialogProps = DialogProps & { req: TestRequest; data: HeringtonTestResponse };

export const HeringtonTestDialog: FC<HeringtonTestDialogProps> = ({ open, handleClose, req, data }) => {
    const label = `${req.compound1}-${req.compound2} ${req.dataset}`;
    const { herington_DJ_criterion } = useConfig();
    const reasons = [`|D–J| ${data.is_consistent ? '<=' : '>'} ${toSigDgts(herington_DJ_criterion)}`];

    return (
        <ResponsiveDialog maxWidth="md" fullWidth open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Herington test for {label}</DialogTitleWithX>
            <DialogContent>
                {data.isothermal_error ? (
                    <Alert severity="error">
                        Isothermal data detected, this test makes no sense!
                        <br />
                        Please use the Redlich-Kister test instead.
                    </Alert>
                ) : (
                    <ConsistencyResult warnings={data.warnings} is_consistent={data.is_consistent} reasons={reasons} />
                )}
                <Box m={2} pb={2}>
                    <table>
                        <tbody>
                            <tr>
                                <td width="70">D</td>
                                <td>{toSigDgts(data.D)}</td>
                            </tr>
                            <tr>
                                <td>J</td>
                                <td>{toSigDgts(data.J)}</td>
                            </tr>
                            <tr>
                                <td>|D–J|</td>
                                <td>{toSigDgts(data.DJ)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>|D–J| criterion is {toSigDgts(herington_DJ_criterion, sigDgtsCrit)}</p>
                </Box>
            </DialogContent>
        </ResponsiveDialog>
    );
};
