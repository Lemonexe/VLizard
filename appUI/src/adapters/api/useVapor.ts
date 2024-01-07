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

export const getVaporModelsKey = 'getVaporModels';

export const useGetVaporModels = () =>
    useQuery(getVaporModelsKey, async () => {
        const { data } = await axios.get<GetVaporModelsResponse>('http://localhost:4663/vapor');
        return data;
    });

export const useVaporAnalysis = () =>
    useMutation('vaporAnalysis', async (payload: VaporAnalysisRequest) => {
        const { data } = await axios.post<VaporAnalysisResponse>('http://localhost:4663/vapor/analysis', payload);
        return data;
    });

export const useUpdateVaporModel = () =>
    useMutation('updateVaporModel', async (payload: UpdateVaporModelRequest) => {
        await axios.put('http://localhost:4663/vapor', { data: payload });
    });

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
