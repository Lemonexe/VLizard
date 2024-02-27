import { FC, useState } from 'react';
import { DatasetIdentifier } from '../../adapters/api/types/common.ts';
import { Button, Dialog, DialogActions, DialogContent, Stack, TextField } from '@mui/material';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { QuestionMark } from '@mui/icons-material';
import { useVLEAnalysisDialog } from '../../actions/VLEAnalysis/useVLEAnalysisDialog.tsx';
import { useSlopeTestDialog } from '../../actions/Slope/useSlopeTestDialog.tsx';
import { useGammaTestDialog } from '../../actions/Gamma/useGammaTestDialog.tsx';
import { useRKTestDialog } from '../../actions/RK/useRKTestDialog.tsx';
import { useHeringtonTestDialog } from '../../actions/Herington/useHeringtonTestDialog.tsx';
import { useFredenslundTestDialog } from '../../actions/Fredenslund/useFredenslundTestDialog.tsx';
import { useConfig } from '../../contexts/ConfigContext.tsx';

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
    const { perform, result } = useSlopeTestDialog(props);
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
    const { perform, result } = useGammaTestDialog(props);
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
    const { perform, result } = useRKTestDialog(props);
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
    const { perform, result } = useHeringtonTestDialog(props);
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
    const { default_legendre_order } = useConfig();
    const [legendre_order, setLegendre_order] = useState(default_legendre_order);
    const { perform, result } = useFredenslundTestDialog({ ...props, legendre_order });
    const [nextStep, setNextStep] = useState(false);
    const sendAndReset = () => {
        setNextStep(false);
        perform();
    };

    const form = !nextStep ? (
        <Button variant="contained" onClick={() => setNextStep(true)}>
            Fredenslund test
        </Button>
    ) : (
        <form onSubmit={sendAndReset}>
            <Stack direction="row" gap={1}>
                <TextField
                    type="number"
                    label="Legendre polynomial order"
                    value={legendre_order}
                    onChange={(e) => setLegendre_order(parseInt(e.target.value))}
                    inputProps={{ min: 3, max: 5 }}
                    size="small"
                    autoFocus
                    fullWidth
                />
                <Button variant="contained" onClick={sendAndReset}>
                    Run
                </Button>
            </Stack>
        </form>
    );

    return (
        <>
            {form}
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
