import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '../../contexts/NotificationContext.tsx';
import { useNotifyErrorMessage } from './helpers/getApiErrorMessage.ts';
import {
    DeleteVaporModelRequest,
    GetVaporModelDefsResponse,
    GetVaporModelsResponse,
    UpdateVaporModelRequest,
    VaporAnalysisRequest,
    VaporAnalysisResponse,
    VaporQueryRequest,
    VaporQueryResponse,
} from './types/vaporTypes.ts';
import { axiosGetWithHandling } from './helpers/axiosGetWithHandling.ts';
import { hostName } from './helpers/hostName.ts';

export const getVaporModelsKey = ['Pure compounds data']; // also a description

export const useGetVaporModels = () => {
    const pushNotification = useNotifications();
    return useQuery({
        queryKey: getVaporModelsKey,
        queryFn: () =>
            axiosGetWithHandling<GetVaporModelsResponse>(hostName + '/vapor', pushNotification, getVaporModelsKey[0]),
    });
};

export const useGetVaporModelDefs = () => {
    const pushNotification = useNotifications();
    return useQuery({
        queryKey: ['Vapor pressure model definitions'],
        queryFn: () =>
            axiosGetWithHandling<GetVaporModelDefsResponse>(hostName + '/vapor/definitions', pushNotification),
    });
};

export const useVaporAnalysis = () => {
    const onError = useNotifyErrorMessage();
    return useMutation({
        mutationFn: async (payload: VaporAnalysisRequest) => {
            const { data } = await axios.post<VaporAnalysisResponse>(hostName + '/vapor/analysis', payload);
            return data;
        },
        onError,
    });
};

export const useVaporQuery = () => {
    const onError = useNotifyErrorMessage();
    return useMutation({
        mutationFn: async (payload: VaporQueryRequest) => {
            const { data } = await axios.post<VaporQueryResponse>(hostName + '/vapor/query', payload);
            return data;
        },
        onError,
    });
};

export const useUpdateVaporModel = () => {
    const queryClient = useQueryClient();
    const onError = useNotifyErrorMessage();
    return useMutation({
        mutationFn: async (payload: UpdateVaporModelRequest) => {
            await axios.put(hostName + '/vapor', payload);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getVaporModelsKey }),
        onError,
    });
};

export const useDeleteVaporModel = () => {
    const queryClient = useQueryClient();
    const onError = useNotifyErrorMessage();
    return useMutation({
        mutationFn: async (payload: DeleteVaporModelRequest) => {
            await axios.delete(hostName + '/vapor', { data: payload });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getVaporModelsKey }),
        onError,
    });
};
