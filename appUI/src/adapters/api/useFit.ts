import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNotifications } from '../../contexts/NotificationContext.tsx';
import { DeleteFitRequest, FitAnalysisRequest, FitAnalysisResponse, GetPersistedFitsResponse } from './types/fit.ts';
import { getApiErrorMessage } from './helpers/getApiErrorMessage.ts';
import { hostName } from './helpers/hostName.ts';

export const getPersistedFitsKey = 'VLE regressions data'; // also a description

export const useGetPersistedFits = () => {
    const pushNotification = useNotifications();
    return useQuery(
        getPersistedFitsKey,
        async () => {
            const { data } = await axios.get<GetPersistedFitsResponse>(hostName + '/fit');
            return data;
        },
        { onError: (e) => pushNotification({ message: getApiErrorMessage(e), severity: 'error' }) },
    );
};

export const useFitAnalysis = () => {
    const queryClient = useQueryClient();
    return useMutation(
        'fitAnalysis',
        async (payload: FitAnalysisRequest) => {
            const { data } = await axios.post<FitAnalysisResponse>(hostName + '/fit', payload);
            return data;
        },
        { onSuccess: () => queryClient.invalidateQueries(getPersistedFitsKey) },
    );
};

export const useDeleteFit = () => {
    const queryClient = useQueryClient();
    const pushNotification = useNotifications();
    return useMutation(
        'deleteFit',
        async (payload: DeleteFitRequest) => {
            await axios.delete(hostName + '/fit', { data: payload });
        },
        {
            onSuccess: () => queryClient.invalidateQueries(getPersistedFitsKey),
            onError: () => pushNotification({ message: `Error deleting compound!`, severity: 'error' }),
        },
    );
};
