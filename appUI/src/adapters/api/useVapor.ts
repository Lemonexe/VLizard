import axios from 'axios';
import { useMutation, useQuery } from 'react-query';
import {
    DeleteVaporModelRequest,
    GetVaporModelsResponse,
    UpdateVaporModelRequest,
    VaporAnalysisRequest,
    VaporAnalysisResponse,
} from './types/vapor.ts';

export const useGetVaporModels = () =>
    useQuery('getVaporModels', () => axios.get<GetVaporModelsResponse>('http://localhost:4663/vapor'));

export const useVaporAnalysis = () =>
    useMutation('vaporAnalysis', async (payload: VaporAnalysisRequest) => {
        const { data } = await axios.post<VaporAnalysisResponse>('http://localhost:4663/vapor/analysis', payload);
        return data;
    });

export const useUpdateVaporModel = () =>
    useMutation('updateVaporModel', async (payload: UpdateVaporModelRequest) => {
        await axios.put('http://localhost:4663/vapor', { data: payload });
    });

export const useDeleteVaporModel = () =>
    useMutation('deleteVaporModel', async (payload: DeleteVaporModelRequest) => {
        await axios.delete('http://localhost:4663/vapor', { data: payload });
    });
