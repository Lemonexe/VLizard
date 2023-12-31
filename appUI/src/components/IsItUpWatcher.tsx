import { FC, PropsWithChildren } from 'react';
import { useIsItUp } from '../adapters/api/isItUp.ts';
import { ErrorAlert } from './ErrorAlert.tsx';

export const IsItUpWatcher: FC<PropsWithChildren> = ({ children }) => {
    const { data } = useIsItUp();

    // undefined means fetching, so we optimistically consider it up
    const isItDown = data === false;

    return isItDown ? <ErrorAlert message="Cannot connect to App Core server." /> : children;
};
