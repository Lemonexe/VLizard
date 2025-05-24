import { QuestionMark } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, Stack } from '@mui/material';
import { FC } from 'react';

import { DatasetIdentifier } from '../../adapters/api/types/common.ts';
import { TEST_OVERVIEW_URL } from '../../adapters/io/URL.ts';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';

import { FredenslundTestButton } from './buttons/TDTest/FredenslundTestButton.tsx';
import { GammaTestButton } from './buttons/TDTest/GammaTestButton.tsx';
import { HeringtonTestButton } from './buttons/TDTest/HeringtonTestButton.tsx';
import { RKTestButton } from './buttons/TDTest/RKTestButton.tsx';
import { SlopeTestButton } from './buttons/TDTest/SlopeTestButton.tsx';
import { VLEAnalysisButton } from './buttons/TDTest/VLEAnalysisButton.tsx';
import { VanNessTestButton } from './buttons/TDTest/VanNessTestButton.tsx';

export const ChooseTDTestDialog: FC<DialogProps & DatasetIdentifier> = ({ open, handleClose, ...props }) => (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitleWithX handleClose={handleClose}>
            Analysis for {props.compound1}-{props.compound2} {props.dataset}
        </DialogTitleWithX>
        <DialogContent>
            <Stack direction="column" gap={1} px={5} py={1}>
                <VLEAnalysisButton {...props} />
                <Button startIcon={<QuestionMark />} href={TEST_OVERVIEW_URL} variant="outlined" sx={{ my: 2 }}>
                    Which test to choose
                </Button>
                <FredenslundTestButton {...props} />
                <VanNessTestButton {...props} />
                <GammaTestButton {...props} />
                <RKTestButton {...props} />
                <HeringtonTestButton {...props} />
                <SlopeTestButton {...props} />
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} variant="outlined">
                Cancel
            </Button>
        </DialogActions>
    </Dialog>
);
