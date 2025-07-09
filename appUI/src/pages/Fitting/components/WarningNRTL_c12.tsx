import { Alert } from '@mui/material';

export const WarningNRTL_c12 = () => (
    <Alert severity="warning">
        <b>
            NRTL <i>c12</i> close to 0 does not make sense!
        </b>
        <br />
        It effectively reduces the four remaining parameters <i>a12, a21, b12, b21</i> into just two symmetrical params.
        <br />
        Expect them to be strongly autocorrelated, or use a simpler model instead.
    </Alert>
);
