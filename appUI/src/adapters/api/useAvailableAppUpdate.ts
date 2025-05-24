import { useQuery } from '@tanstack/react-query';
import semver from 'semver';

import { useNotifications } from '../../contexts/NotificationContext.tsx';
import { REMOTE_PACKAGE_JSON_URL } from '../io/URL.ts';

import { axiosGetWithHandling } from './helpers/axiosGetWithHandling.ts';

export const remotePackageJsonKey = ['Remote app update info'];

type MinimalPackageJson = { version: string };

const useGetRemotePackageJson = () => {
    const pushNotification = useNotifications();
    return useQuery({
        queryKey: remotePackageJsonKey,
        queryFn: () =>
            axiosGetWithHandling<MinimalPackageJson>(
                REMOTE_PACKAGE_JSON_URL,
                pushNotification,
                remotePackageJsonKey[0],
            ),
    });
};

export const useAvailableAppUpdate = (): string | null => {
    const { data } = useGetRemotePackageJson();
    if (!data) return null;
    const { version: remoteVersion } = data;
    if (typeof remoteVersion !== 'string') return null;

    return semver.gt(remoteVersion, APP_VERSION) ? remoteVersion : null;
};
