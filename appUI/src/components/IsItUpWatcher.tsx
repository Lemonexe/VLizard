import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { ping, PING_INIT_INTERVAL, PING_INTERVAL } from '../adapters/api/ping.ts';
import { ContentContainer } from './Mui/ContentContainer.tsx';
import { ErrorAlert } from './ErrorAlert.tsx';
import { Loader } from './Loader.tsx';

const FAILURES_THRESHOLD = 3;

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

        const pingInterval = wasEverUp ? PING_INTERVAL : PING_INIT_INTERVAL;
        const pingIntervalHandle = setInterval(pingAndCount, pingInterval);
        return () => clearInterval(pingIntervalHandle);
    }, [wasEverUp]);

    if (!wasEverUp) return <ContentContainer children={<Loader subject="Core server" />} />;
    if (failuresInRow >= FAILURES_THRESHOLD) return <ErrorAlert message="Lost connection to the Core server! 😱" />;
    return children;
};
