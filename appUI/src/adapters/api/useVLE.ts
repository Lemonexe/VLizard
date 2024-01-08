import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNotifications } from '../NotificationContext.tsx';
import {
    DeleteVLERequest,
    GetVLESystemsResponse,
    UpsertVLEDatasetRequest,
    VLEAnalysisRequest,
    VLEAnalysisResponse,
} from './types/VLE.ts';
import { useHandleApiError } from './helpers/getApiErrorMessage.ts';

export const getVLESystemsKey = 'Binary systems data'; // also a description

export const useGetVLESystems = () => {
    const handleApiError = useHandleApiError();
    return useQuery(getVLESystemsKey, async () => {
        try {
            const { data } = await axios.get<GetVLESystemsResponse>('http://localhost:4663/vle');
            return data;
        } catch (e) {
            handleApiError(e);
            throw e;
        }
    });
};

export const useVLEAnalysis = () =>
    useMutation('VLEAnalysis', async (payload: VLEAnalysisRequest) => {
        const { data } = await axios.post<VLEAnalysisResponse>('http://localhost:4663/vle/analysis', payload);
        return data;
    });

export const useUpsertVLEDataset = () => {
    const queryClient = useQueryClient();
    const pushNotification = useNotifications();
    return useMutation(
        'upsertVLEDataset',
        async (payload: UpsertVLEDatasetRequest) => {
            await axios.post('http://localhost:4663/vle', { data: payload });
        },
        {
            onSuccess: () => queryClient.invalidateQueries(getVLESystemsKey),
            onError: () => pushNotification({ message: `Error saving VLE dataset!`, severity: 'error' }),
        },
    );
};

export const useDeleteVLE = () => {
    const queryClient = useQueryClient();
    const pushNotification = useNotifications();
    return useMutation(
        'deleteVLE',
        async (payload: DeleteVLERequest) => {
            await axios.delete('http://localhost:4663/vle', { data: payload });
        },
        {
            onSuccess: () => queryClient.invalidateQueries(getVLESystemsKey),
            onError: () => pushNotification({ message: `Error deleting datasets or systems!`, severity: 'error' }),
        },
    );
};
