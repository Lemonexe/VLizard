import { Box } from '@mui/material';
import { FC } from 'react';

import { spacingN } from '../../contexts/MUITheme.tsx';

export const FitVaporResultsHelp: FC = () => (
    <Box ml={4}>
        Two optimization methods are employed:
        <ul style={{ marginBottom: 0, marginTop: spacingN(1) }}>
            <li>
                <u>p-optimization</u>: standard curve fitting, which only considers residuals of the dependent variable
                (<i>p</i>).
            </li>
            <li>
                <u>T,p-optimization</u>: orthogonal distance regression, which considers residuals of both variables (
                <i>T</i>, <i>p</i>).
                <ul>
                    <li>
                        This is <b>recommended</b>, as both variables have significant uncertainties.
                    </li>
                    <li>But it may be unstable, so both methods are offered.</li>
                    <li>
                        Note that RMS & AAD are always calculated only from <i>p</i> residuals, so they{' '}
                        <i>may actually increase</i> with T,p-optimization.
                    </li>
                </ul>
            </li>
        </ul>
    </Box>
);
