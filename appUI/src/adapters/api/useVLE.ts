import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '../../contexts/NotificationContext.tsx';
import { useNotifyErrorMessage } from './helpers/getApiErrorMessage.ts';
import {
    DeleteVLERequest,
    GetVLESystemsResponse,
    UpsertVLEDatasetRequest,
    VLEAnalysisRequest,
    VLEAnalysisResponse,
} from './types/VLETypes.ts';
import { axiosGetWithHandling } from './helpers/axiosGetWithHandling.ts';
import { hostName } from './helpers/hostName.ts';

export const getVLESystemsKey = ['Binary systems data']; // also a description

export const useGetVLESystems = () => {
    const pushNotification = useNotifications();
    return useQuery({
        queryKey: getVLESystemsKey,
        queryFn: () =>
            axiosGetWithHandling<GetVLESystemsResponse>(hostName + '/vle', pushNotification, getVLESystemsKey[0]),
    });
};

export const useVLEAnalysis = () => {
    const onError = useNotifyErrorMessage();
    return useMutation({
        mutationFn: async (payload: VLEAnalysisRequest) => {
            const { data } = await axios.post<VLEAnalysisResponse>(hostName + '/vle/analysis', payload);
            return data;
        },
        onError,
    });
};

export const useUpsertVLEDataset = () => {
    const queryClient = useQueryClient();
    const onError = useNotifyErrorMessage();
    return useMutation({
        mutationFn: async (payload: UpsertVLEDatasetRequest) => {
            await axios.post(hostName + '/vle', payload);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getVLESystemsKey }),
        onError,
    });
};

export const useDeleteVLE = () => {
    const queryClient = useQueryClient();
    const onError = useNotifyErrorMessage();

    return useMutation({
        mutationFn: async (payload: DeleteVLERequest) => {
            await axios.delete(hostName + '/vle', { data: payload });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getVLESystemsKey }),
        onError,
    });
};
