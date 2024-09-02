import { FC } from 'react';
import { Box } from '@mui/material';
import { spacingN } from '../../../contexts/MUITheme.tsx';

export const InputVaporFitHelp: FC = () => (
    <Box ml={4}>
        Two algorithms are available, but p-optimization is performed always:
        <ul style={{ marginBottom: 0, marginTop: spacingN(1) }}>
            <li>
                <u>p-optimization</u>: standard curve fitting, which only considers dependent variable residuals (
                <i>p</i>).
            </li>
            <li>
                <u>T,p-optimization</u>: considers both variables residuals (<i>T</i>, <i>p</i>).
                <br />
                The residuals are divided by intervals of <i>T</i> & <i>p</i> data respectively so that they can be
                summed.
                <br />
                When enabled, it's done as second step, starting from the p-optimized parameters.
                <br />⚠ Keep in mind it can be unstable!
            </li>
        </ul>
    </Box>
);
