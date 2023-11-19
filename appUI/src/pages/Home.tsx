import { FC } from 'react';
import { Box, Stack, Typography } from '@mui/material';

export const Home: FC = () => (
    <>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <img src="/icon.png" width={128} />
            <Box>
                <Typography variant="h1">Welcome to VLizard</Typography>
                <Typography variant="subtitle1">
                    <i>a VLE wizard</i>
                </Typography>
            </Box>
        </Stack>
        <Typography paragraph>
            VLizard is a free open-source toolbox for advanced processing of vapor-liquid equilibrium data, which
            comprises tests of thermodynamic consistency and&nbsp;model fitting using non-linear regression.
        </Typography>
    </>
);
