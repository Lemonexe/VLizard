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
} from './types/vapor.ts';
import { axiosGetWithHandling } from './helpers/axiosGetWithHandling.ts';
import { hostName } from './helpers/hostName.ts';

export const getVaporModelsKey = ['Pure compounds data']; // also a description

export const useGetVaporModels = () => {
    const pushNotification = useNotifications();
    return useQuery(getVaporModelsKey, async () =>
        axiosGetWithHandling<GetVaporModelsResponse>(hostName + '/vapor', pushNotification, getVaporModelsKey[0]),
    );
};

export const useGetVaporModelDefs = () => {
    const pushNotification = useNotifications();
    return useQuery(['Vapor pressure model definitions'], async () =>
        axiosGetWithHandling<GetVaporModelDefsResponse>(hostName + '/vapor/definitions', pushNotification),
    );
};

export const useVaporAnalysis = () =>
    useMutation(['vaporAnalysis'], async (payload: VaporAnalysisRequest) => {
        const { data } = await axios.post<VaporAnalysisResponse>(hostName + '/vapor/analysis', payload);
        return data;
    });

export const useUpdateVaporModel = () => {
    const queryClient = useQueryClient();
    const onError = useNotifyErrorMessage();
    return useMutation(
        ['updateVaporModel'],
        async (payload: UpdateVaporModelRequest) => {
            await axios.put(hostName + '/vapor', payload);
        },
        {
            onSuccess: () => queryClient.invalidateQueries(getVaporModelsKey),
            onError,
        },
    );
};

export const useDeleteVaporModel = () => {
    const queryClient = useQueryClient();
    const onError = useNotifyErrorMessage();
    return useMutation(
        ['deleteVaporModel'],
        async (payload: DeleteVaporModelRequest) => {
            await axios.delete(hostName + '/vapor', { data: payload });
        },
        {
            onSuccess: () => queryClient.invalidateQueries(getVaporModelsKey),
            onError,
        },
    );
};
