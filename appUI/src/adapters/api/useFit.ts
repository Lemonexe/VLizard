import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNotifications } from '../NotificationContext.tsx';
import { DeleteFitRequest, FitAnalysisRequest, FitAnalysisResponse, GetPersistedFitsResponse } from './types/fit.ts';

export const getPersistedFitsKey = 'VLE regressions data'; // also a description

export const useGetPersistedFits = () =>
    useQuery(getPersistedFitsKey, async () => {
        const { data } = await axios.get<GetPersistedFitsResponse>('http://localhost:4663/fit/VLE');
        return data;
    });

export const useFitAnalysis = () => {
    const queryClient = useQueryClient();
    return useMutation(
        'fitAnalysis',
        async (payload: FitAnalysisRequest) => {
            const { data } = await axios.post<FitAnalysisResponse>('http://localhost:4663/fit/VLE', payload);
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
            await axios.delete('http://localhost:4663/fit/VLE', { data: payload });
        },
        {
            onSuccess: () => queryClient.invalidateQueries(getPersistedFitsKey),
            onError: () => pushNotification({ message: `Error deleting compound!`, severity: 'error' }),
        },
    );
};
