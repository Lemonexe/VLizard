import { QueryKey, useQueryClient } from 'react-query';
import { useNotifications } from '../../NotificationContext.tsx';
import { getVaporModelsKey } from '../useVapor.ts';
import { getPersistedFitsKey } from '../useFit.ts';
import { getVLESystemsKey } from '../useVLE.ts';
import { AxiosError } from 'axios';

const queryKeys: QueryKey[] = [getVaporModelsKey, getVLESystemsKey, getPersistedFitsKey];

export const useInvalidateAllQueries = () => {
    const queryClient = useQueryClient();
    const pushNotification = useNotifications();

    return async () => {
        try {
            await Promise.all(
                queryKeys.map(async (queryKey) => {
                    await queryClient.invalidateQueries(queryKey, undefined, { throwOnError: true });
                }),
            );
            pushNotification({ message: 'Data was refreshed.', severity: 'success' });
        } catch (e) {
            const message = e instanceof AxiosError ? e.response?.data.error ?? e : e;
            pushNotification({ message, severity: 'error' });
        }
    };
};
