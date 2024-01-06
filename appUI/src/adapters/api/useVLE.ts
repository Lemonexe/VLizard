import axios from 'axios';
import { useMutation, useQuery } from 'react-query';
import {
    DeleteVLEDatasetRequest,
    GetVLESystemsResponse,
    UpsertVLEDatasetRequest,
    VLEAnalysisRequest,
    VLEAnalysisResponse,
} from './types/VLE.ts';

export const useGetVLESystems = () =>
    useQuery('getVLESystems', async () => {
        const { data } = await axios.get<GetVLESystemsResponse>('http://localhost:4663/vle');
        return data;
    });

export const useVLEAnalysis = () =>
    useMutation('VLEAnalysis', async (payload: VLEAnalysisRequest) => {
        const { data } = await axios.post<VLEAnalysisResponse>('http://localhost:4663/vle/analysis', payload);
        return data;
    });

export const useUpsertVLEDataset = () =>
    useMutation('upsertVLEDataset', async (payload: UpsertVLEDatasetRequest) => {
        await axios.post('http://localhost:4663/vle', { data: payload });
    });

export const useDeleteVLEDataset = () =>
    useMutation('deleteVLEDataset', async (payload: DeleteVLEDatasetRequest) => {
        await axios.delete('http://localhost:4663/vle', { data: payload });
    });
