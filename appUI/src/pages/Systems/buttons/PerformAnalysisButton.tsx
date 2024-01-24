import { FC, Fragment, useCallback, useMemo, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, IconButton, Stack, Tooltip } from '@mui/material';
import { QueryStats, QuestionMark } from '@mui/icons-material';
import { DialogTitleWithX } from '../../../components/Mui/DialogTitle.tsx';
import { DatasetIdentifier } from '../../../adapters/api/types/common.ts';
import { TestDialogProps } from '../TDTest/TestDialogProps.ts';
import { VLEAnalysisDialog } from '../TDTest/VLE/VLEAnalysisDialog.tsx';
import { SlopeTestDialog } from '../TDTest/Slope/SlopeTestDialog.tsx';
import { GammaTestDialog } from '../TDTest/Gamma/GammaTestDialog.tsx';
import { RKTestDialog } from '../TDTest/RK/RKTestDialog.tsx';
import { HeringtonTestDialog } from '../TDTest/Herington/HeringtonTestDialog.tsx';
import { FredenslundTestDialog } from '../TDTest/Fredenslund/FredenslundTestDialog.tsx';

type TDTestInterfaceTemplate = {
    label: string;
    DialogComponent: FC<TestDialogProps>;
};
const TDTestInterfaceTemplates: TDTestInterfaceTemplate[] = [
    { label: 'Visualize data', DialogComponent: VLEAnalysisDialog },
    { label: 'Slope test', DialogComponent: SlopeTestDialog },
    { label: 'Gamma test', DialogComponent: GammaTestDialog },
    { label: 'Redlich-Kister test', DialogComponent: RKTestDialog },
    { label: 'Herington test', DialogComponent: HeringtonTestDialog },
    { label: 'Fredenslund test', DialogComponent: FredenslundTestDialog },
];

export const PerformTDTestButton: FC<DatasetIdentifier> = ({ compound1, compound2, dataset }) => {
    const [open, setOpen] = useState(false);
    const handleClose = useCallback(() => setOpen(false), []);
    const [openTest, setOpenTest] = useState<string | null>(null);

    const testsInterface = useMemo(
        () =>
            TDTestInterfaceTemplates.map(({ label, DialogComponent }) => (
                <Fragment key={label}>
                    <Button variant="contained" onClick={() => setOpenTest(label)}>
                        {label}
                    </Button>
                    {openTest === label && (
                        <DialogComponent
                            open={openTest === label}
                            handleClose={() => setOpenTest(null)}
                            compound1={compound1}
                            compound2={compound2}
                            dataset={dataset}
                        />
                    )}
                </Fragment>
            )),
        [compound1, compound2, dataset, openTest],
    );

    return (
        <>
            <Tooltip title="Perform analysis">
                <IconButton children={<QueryStats />} onClick={() => setOpen(true)} />
            </Tooltip>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'xs'}>
                <DialogTitleWithX handleClose={handleClose}>
                    Analysis for {compound1}-{compound2} {dataset}
                </DialogTitleWithX>
                <DialogContent>
                    <Stack direction="column" gap={3} px={5} py={1}>
                        <Button
                            startIcon={<QuestionMark />}
                            href="https://github.com/Lemonexe/VLizard/blob/master/docs/user/VLE_analyses.md"
                            variant="outlined"
                        >
                            Which test to choose
                        </Button>

                        {testsInterface}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
