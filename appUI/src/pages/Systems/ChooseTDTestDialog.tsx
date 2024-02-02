import { FC } from 'react';
import { DatasetIdentifier } from '../../adapters/api/types/common.ts';
import { useVLEAnalysisDialog } from '../../actions/VLEAnalysis/useVLEAnalysisDialog.tsx';
import { Button, Dialog, DialogActions, DialogContent, Stack } from '@mui/material';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { QuestionMark } from '@mui/icons-material';

const VLEAnalysisButton: FC<DatasetIdentifier> = (props) => {
    const { perform, result } = useVLEAnalysisDialog(props);
    return (
        <>
            <Button variant="contained" onClick={perform}>
                Visualize data
            </Button>
            {result}
        </>
    );
};

const SlopeTestButton: FC<DatasetIdentifier> = (props) => {
    const { perform, result } = useVLEAnalysisDialog(props);
    return (
        <>
            <Button variant="contained" onClick={perform}>
                Slope test
            </Button>
            {result}
        </>
    );
};

const GammaTestButton: FC<DatasetIdentifier> = (props) => {
    const { perform, result } = useVLEAnalysisDialog(props);
    return (
        <>
            <Button variant="contained" onClick={perform}>
                Gamma test
            </Button>
            {result}
        </>
    );
};

const RKTestButton: FC<DatasetIdentifier> = (props) => {
    const { perform, result } = useVLEAnalysisDialog(props);
    return (
        <>
            <Button variant="contained" onClick={perform}>
                Redlich-Kister test
            </Button>
            {result}
        </>
    );
};

const HeringtonTestButton: FC<DatasetIdentifier> = (props) => {
    const { perform, result } = useVLEAnalysisDialog(props);
    return (
        <>
            <Button variant="contained" onClick={perform}>
                Herington test
            </Button>
            {result}
        </>
    );
};

const FredenslundTestButton: FC<DatasetIdentifier> = (props) => {
    const { perform, result } = useVLEAnalysisDialog(props);
    return (
        <>
            <Button variant="contained" onClick={perform}>
                Fredenslund test
            </Button>
            {result}
        </>
    );
};

export const ChooseTDTestDialog: FC<DialogProps & DatasetIdentifier> = ({ open, handleClose, ...props }) => (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'xs'}>
        <DialogTitleWithX handleClose={handleClose}>
            Analysis for {props.compound1}-{props.compound2} {props.dataset}
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

                <VLEAnalysisButton {...props} />
                <SlopeTestButton {...props} />
                <GammaTestButton {...props} />
                <RKTestButton {...props} />
                <HeringtonTestButton {...props} />
                <FredenslundTestButton {...props} />
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} variant="outlined">
                Cancel
            </Button>
        </DialogActions>
    </Dialog>
);
