import axios from 'axios';
import { useMutation, useQuery } from 'react-query';
import { DeleteFitRequest, FitAnalysisRequest, FitAnalysisResponse, GetPersistedFitsResponse } from './types/fit.ts';

export const useGetPersistedFits = () =>
    useQuery('getPersistedFits', async () => {
        const { data } = await axios.get<GetPersistedFitsResponse>('http://localhost:4663/fit/VLE');
        return data;
    });

export const useFitAnalysis = () =>
    useMutation('fitAnalysis', async (payload: FitAnalysisRequest) => {
        const { data } = await axios.post<FitAnalysisResponse>('http://localhost:4663/fit/VLE', payload);
        return data;
    });

export const useDeleteFit = () =>
    useMutation('deleteFit', async (payload: DeleteFitRequest) => {
        await axios.delete('http://localhost:4663/fit/VLE', { data: payload });
    });
