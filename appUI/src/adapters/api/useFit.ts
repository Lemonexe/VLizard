import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '../../contexts/NotificationContext.tsx';
import { useNotifyErrorMessage } from './helpers/getApiErrorMessage.ts';
import {
    DeleteFitRequest,
    FitAnalysisRequest,
    FitAnalysisResponse,
    GetPersistedFitsResponse,
    GetVLEModelDefsResponse,
} from './types/fitTypes.ts';
import { hostName } from './helpers/hostName.ts';
import { axiosGetWithHandling } from './helpers/axiosGetWithHandling.ts';

export const getPersistedFitsKey = ['VLE regressions data']; // also a description

export const useGetPersistedFits = () => {
    const pushNotification = useNotifications();
    return useQuery({
        queryKey: getPersistedFitsKey,
        queryFn: async () =>
            axiosGetWithHandling<GetPersistedFitsResponse>(hostName + '/fit', pushNotification, getPersistedFitsKey[0]),
    });
};

export const useGetVLEModelDefs = () => {
    const pushNotification = useNotifications();
    return useQuery({
        queryKey: ['VLE model definitions'],
        queryFn: async () =>
            axiosGetWithHandling<GetVLEModelDefsResponse>(hostName + '/fit/definitions', pushNotification),
    });
};

export const useFitAnalysis = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: FitAnalysisRequest) => {
            const { data } = await axios.post<FitAnalysisResponse>(hostName + '/fit', payload);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getPersistedFitsKey }),
    });
};

export const useDeleteFit = () => {
    const queryClient = useQueryClient();
    const onError = useNotifyErrorMessage();

    return useMutation({
        mutationFn: async (payload: DeleteFitRequest) => {
            await axios.delete(hostName + '/fit', { data: payload });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getPersistedFitsKey }),
        onError,
    });
};
