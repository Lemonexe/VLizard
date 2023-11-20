import { FC, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useNotifications } from '../adapters/NotificationContext.tsx';

const Playground: FC = () => {
    const pushNotification = useNotifications();
    const [shouldThrow, setShouldThrow] = useState(false);
    if (shouldThrow) throw new Error('Test error boundary');
    return (
        <Box>
            <Button
                variant="contained"
                onClick={() => pushNotification({ message: 'This is a notification', severity: 'warning' })}
            >
                Warning notification
            </Button>
            <Button variant="contained" onClick={() => setShouldThrow(true)}>
                Error to boundary
            </Button>
        </Box>
    );
};

export const Home: FC = () => (
    <>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <img src="/icon.png" width={128} alt="VLizard logo" />
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
        <Playground />
    </>
);
