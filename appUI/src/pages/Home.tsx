import { Box, Stack } from '@mui/material';
import { FC } from 'react';

import { DefaultLayout } from '../components/DefaultLayout.tsx';

export const Home: FC = () => (
    <DefaultLayout>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <img src="icon.png" width={128} alt="VLizard logo" />
            <Box>
                <h1>Welcome to VLizard</h1>
                <i>a VLE wizard</i>
            </Box>
        </Stack>
        <p>
            VLizard is a free open-source toolbox for advanced processing of vapor-liquid equilibrium data, which
            comprises tests of thermodynamic consistency and&nbsp;model fitting using non-linear regression.
        </p>
    </DefaultLayout>
);
