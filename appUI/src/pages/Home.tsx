import { FC, useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { useNotifications } from '../adapters/NotificationContext.tsx';

// TEMPORARY, remove this
const Playground: FC = () => {
    const pushNotification = useNotifications();
    const [shouldThrow, setShouldThrow] = useState(false);
    if (shouldThrow) throw new Error('Test error boundary');
    return (
        <Stack gap={1} direction="row" mt={5}>
            <Button
                variant="contained"
                color="warning"
                onClick={() => pushNotification({ message: 'This is a notification', severity: 'warning' })}
            >
                Warning notification
            </Button>
            <Button variant="contained" color="error" onClick={() => setShouldThrow(true)}>
                Error to boundary
            </Button>
        </Stack>
    );
};

export const Home: FC = () => (
    <>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <img src="/icon.png" width={128} alt="VLizard logo" />
            <Box>
                <h1>Welcome to VLizard</h1>
                <i>a VLE wizard</i>
            </Box>
        </Stack>
        <p>
            VLizard is a free open-source toolbox for advanced processing of vapor-liquid equilibrium data, which
            comprises tests of thermodynamic consistency and&nbsp;model fitting using non-linear regression.
        </p>

        <Playground />
    </>
);
