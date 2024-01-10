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
import { hostName } from './helpers/hostName.ts';

export const getVLESystemsKey = 'Binary systems data'; // also a description

export const useGetVLESystems = () => {
    const handleApiError = useHandleApiError();
    return useQuery(getVLESystemsKey, async () => {
        try {
            const { data } = await axios.get<GetVLESystemsResponse>(hostName + '/vle');
            return data;
        } catch (e) {
            handleApiError(e);
            throw e;
        }
    });
};

export const useVLEAnalysis = () =>
    useMutation('VLEAnalysis', async (payload: VLEAnalysisRequest) => {
        const { data } = await axios.post<VLEAnalysisResponse>(hostName + '/vle/analysis', payload);
        return data;
    });

export const useUpsertVLEDataset = () => {
    const queryClient = useQueryClient();
    const pushNotification = useNotifications();
    return useMutation(
        'upsertVLEDataset',
        async (payload: UpsertVLEDatasetRequest) => {
            await axios.post(hostName + '/vle', { data: payload });
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
            await axios.delete(hostName + '/vle', { data: payload });
        },
        {
            onSuccess: () => queryClient.invalidateQueries(getVLESystemsKey),
            onError: () => pushNotification({ message: `Error deleting datasets or systems!`, severity: 'error' }),
        },
    );
};
