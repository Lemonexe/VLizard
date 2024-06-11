import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '../../../contexts/NotificationContext.tsx';
import { getVaporModelsKey } from '../useVapor.ts';
import { getPersistedFitsKey } from '../useFit.ts';
import { getVLESystemsKey } from '../useVLE.ts';
import { getConfigKey } from '../useConfigApi.ts';

const queryKeys: QueryKey[] = [getVaporModelsKey, getVLESystemsKey, getPersistedFitsKey, getConfigKey];

export const useInvalidateAllQueries = () => {
    const queryClient = useQueryClient();
    const pushNotification = useNotifications();

    return async () => {
        await Promise.all(
            queryKeys.map(async (queryKey) => {
                await queryClient.invalidateQueries({ queryKey }, { throwOnError: true });
            }),
        );
        pushNotification({ message: 'Data was refreshed.', severity: 'success' });
        // async error is left unhandled; the individual queries are responsible to pushNotification on error
    };
};
