import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNotifications } from '../NotificationContext.tsx';
import {
    DeleteVaporModelRequest,
    GetVaporModelsResponse,
    UpdateVaporModelRequest,
    VaporAnalysisRequest,
    VaporAnalysisResponse,
} from './types/vapor.ts';
import { useHandleApiError } from './helpers/getApiErrorMessage.ts';

export const getVaporModelsKey = 'Pure compounds data'; // also a description

export const useGetVaporModels = () => {
    const handleApiError = useHandleApiError();
    return useQuery(getVaporModelsKey, async () => {
        try {
            const { data } = await axios.get<GetVaporModelsResponse>('http://localhost:4663/vapor');
            return data;
        } catch (e) {
            handleApiError(e);
            throw e;
        }
    });
};

export const useVaporAnalysis = () =>
    useMutation('vaporAnalysis', async (payload: VaporAnalysisRequest) => {
        const { data } = await axios.post<VaporAnalysisResponse>('http://localhost:4663/vapor/analysis', payload);
        return data;
    });

export const useUpdateVaporModel = () => {
    const queryClient = useQueryClient();
    const pushNotification = useNotifications();
    return useMutation(
        'updateVaporModel',
        async (payload: UpdateVaporModelRequest) => {
            await axios.put('http://localhost:4663/vapor', { data: payload });
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
            await axios.delete('http://localhost:4663/vapor', { data: payload });
        },
        {
            onSuccess: () => queryClient.invalidateQueries(getVaporModelsKey),
            onError: () => pushNotification({ message: `Error deleting compound!`, severity: 'error' }),
        },
    );
};
