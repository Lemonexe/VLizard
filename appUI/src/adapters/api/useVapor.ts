import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNotifications } from '../../contexts/NotificationContext.tsx';
import {
    DeleteVaporModelRequest,
    GetVaporModelDefsResponse,
    GetVaporModelsResponse,
    UpdateVaporModelRequest,
    VaporAnalysisRequest,
    VaporAnalysisResponse,
} from './types/vapor.ts';
import { getApiErrorMessage } from './helpers/getApiErrorMessage.ts';
import { hostName } from './helpers/hostName.ts';

export const getVaporModelsKey = 'Pure compounds data'; // also a description

export const useGetVaporModels = () => {
    const pushNotification = useNotifications();
    return useQuery(
        getVaporModelsKey,
        async () => {
            const { data } = await axios.get<GetVaporModelsResponse>(hostName + '/vapor');
            return data;
        },
        { onError: (e) => pushNotification({ message: getApiErrorMessage(e), severity: 'error' }) },
    );
};

export const useGetVaporModelDefs = () => {
    const pushNotification = useNotifications();
    return useQuery(
        'Vapor pressure model definitions', // static app metadata, will not be requeried
        async () => {
            const { data } = await axios.get<GetVaporModelDefsResponse>(hostName + '/vapor/definitions');
            return data;
        },
        { onError: (e) => pushNotification({ message: getApiErrorMessage(e), severity: 'error' }) },
    );
};

export const useVaporAnalysis = () =>
    useMutation('vaporAnalysis', async (payload: VaporAnalysisRequest) => {
        const { data } = await axios.post<VaporAnalysisResponse>(hostName + '/vapor/analysis', payload);
        return data;
    });

export const useUpdateVaporModel = () => {
    const queryClient = useQueryClient();
    const pushNotification = useNotifications();
    return useMutation(
        'updateVaporModel',
        async (payload: UpdateVaporModelRequest) => {
            await axios.put(hostName + '/vapor', payload);
        },
        {
            onSuccess: () => queryClient.invalidateQueries(getVaporModelsKey),
            onError: () => pushNotification({ message: `Error updating vapor pressure models!`, severity: 'error' }),
        },
    );
};

export const useDeleteVaporModel = () => {
    const queryClient = useQueryClient();
    const pushNotification = useNotifications();
    return useMutation(
        'deleteVaporModel',
        async (payload: DeleteVaporModelRequest) => {
            await axios.delete(hostName + '/vapor', { data: payload });
        },
        {
            onSuccess: () => queryClient.invalidateQueries(getVaporModelsKey),
            onError: () => pushNotification({ message: `Error deleting compound!`, severity: 'error' }),
        },
    );
};
