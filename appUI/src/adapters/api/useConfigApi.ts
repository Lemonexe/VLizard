import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback } from 'react';

import { useNotifications } from '../../contexts/NotificationContext.tsx';

import { axiosGetWithHandling } from './helpers/axiosGetWithHandling.ts';
import { useNotifyErrorMessage } from './helpers/getApiErrorMessage.ts';
import { hostName } from './helpers/hostName.ts';
import { Config, UpdateConfigRequest } from './types/configTypes.ts';

export const getConfigKey = ['User config'];

export const useGetConfig = () => {
    const pushNotification = useNotifications();
    return useQuery({
        queryKey: getConfigKey,
        queryFn: () => axiosGetWithHandling<Config>(hostName + '/config', pushNotification, getConfigKey[0]),
    });
};

export const useUpdateConfig = () => {
    const queryClient = useQueryClient();
    const onError = useNotifyErrorMessage();
    return useMutation({
        mutationFn: async (payload: UpdateConfigRequest) => {
            await axios.put(hostName + '/config', payload);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getConfigKey }),
        onError,
    });
};

export const useOpenDataDirectory = () => useCallback(() => axios.get(hostName + '/config/open_data_dir'), []);
