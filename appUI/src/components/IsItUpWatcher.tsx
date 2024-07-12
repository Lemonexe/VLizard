import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { ping, PING_INIT_INTERVAL, PING_INTERVAL } from '../adapters/api/ping.ts';
import { determine2ndInstance } from '../adapters/electron.ts';
import { ErrorAlert } from './ErrorAlert.tsx';
import { CenteredLoader } from './Loader.tsx';

const FAILURES_THRESHOLD = 3;

const MainInstanceError: FC = () => <ErrorAlert message="Lost connection to the Core server! 😱" />;
const SecondaryInstanceError: FC = () => (
    <Stack justifyContent="center" alignItems="center" height="100vh">
        <p>You have opened multiple VLizard windows, but closed the main one.</p>
        <p>Working with multiple windows is totally fine, but the main one has to keep running for the others.</p>
        <p>
            <strong>Please, either open VLizard again, or close this window.</strong>
        </p>
    </Stack>
);

export const IsItUpWatcher: FC<PropsWithChildren> = ({ children }) => {
    const [wasEverUp, setWasEverUp] = useState(false);
    const [failuresInRow, setFailuresInRow] = useState(0);

    useEffect(() => {
        const pingAndCount = async () => {
            const ok = await ping();
            if (!wasEverUp && ok) setWasEverUp(true);
            if (!ok) setFailuresInRow((prev) => prev + 1);
            if (ok) setFailuresInRow(0);
        };
        pingAndCount().then();

        const pingInterval = wasEverUp ? PING_INTERVAL : PING_INIT_INTERVAL;
        const pingIntervalHandle = setInterval(pingAndCount, pingInterval);
        return () => clearInterval(pingIntervalHandle);
    }, [wasEverUp]);

    if (!wasEverUp) return <CenteredLoader subject="Core server" />;

    const is2ndInstance = determine2ndInstance();
    if (failuresInRow >= FAILURES_THRESHOLD) return is2ndInstance ? <SecondaryInstanceError /> : <MainInstanceError />;
    return children;
};
