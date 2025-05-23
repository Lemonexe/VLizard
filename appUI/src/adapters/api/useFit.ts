import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useNotifications } from '../../contexts/NotificationContext.tsx';

import { axiosGetWithHandling } from './helpers/axiosGetWithHandling.ts';
import { useNotifyErrorMessage } from './helpers/getApiErrorMessage.ts';
import { hostName } from './helpers/hostName.ts';
import {
    DeleteFitRequest,
    FitAnalysisRequest,
    FitAnalysisResponse,
    FitTabulateRequest,
    GetPersistedFitsResponse,
    TabulatedDataset,
    VaporFitRequest,
    VaporFitResponse,
} from './types/fitTypes.ts';

export const getPersistedFitsKey = ['VLE regressions data']; // also a description

export const useGetPersistedFits = () => {
    const pushNotification = useNotifications();
    const label = getPersistedFitsKey[0];
    return useQuery({
        queryKey: getPersistedFitsKey,
        queryFn: () => axiosGetWithHandling<GetPersistedFitsResponse>(hostName + '/fit/vle', pushNotification, label),
    });
};

export const useVLEFit = () => {
    const queryClient = useQueryClient();
    const onError = useNotifyErrorMessage();
    return useMutation({
        mutationFn: async (payload: FitAnalysisRequest) => {
            const { data } = await axios.post<FitAnalysisResponse>(hostName + '/fit/vle', payload);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getPersistedFitsKey }),
        onError,
    });
};

export const useVaporFit = () => {
    const onError = useNotifyErrorMessage();
    return useMutation({
        mutationFn: async (payload: VaporFitRequest) => {
            const { data } = await axios.post<VaporFitResponse>(hostName + '/fit/vapor', payload);
            return data;
        },
        onError,
    });
};

export const useDeleteFit = () => {
    const queryClient = useQueryClient();
    const onError = useNotifyErrorMessage();

    return useMutation({
        mutationFn: async (payload: DeleteFitRequest) => {
            await axios.delete(hostName + '/fit/vle', { data: payload });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getPersistedFitsKey }),
        onError,
    });
};

export const useTabulateVLEFit = () => {
    const onError = useNotifyErrorMessage();
    return useMutation({
        mutationFn: async (payload: FitTabulateRequest) => {
            const { data } = await axios.post<TabulatedDataset>(hostName + '/fit/vle/tabulate', payload);
            return data;
        },
        onError,
    });
};
