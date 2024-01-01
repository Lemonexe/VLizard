import axios from 'axios';
import { useMutation } from 'react-query';
import {
    FredenslundTestRequest,
    FredenslundTestResponse,
    GammaTestResponse,
    HeringtonTestResponse,
    RKTestResponse,
    SlopeTestResponse,
    TestRequest,
} from './types/TDTest.ts';

export const useGammaTest = () =>
    useMutation('testGamma', async (payload: TestRequest) => {
        const { data } = await axios.post<GammaTestResponse>('http://localhost:4663/td_test/gamma', payload);
        return data;
    });

export const useSlopeTest = () =>
    useMutation('testSlope', async (payload: TestRequest) => {
        const { data } = await axios.post<SlopeTestResponse>('http://localhost:4663/td_test/slope', payload);
        return data;
    });

export const useRKTest = () =>
    useMutation('testRK', async (payload: TestRequest) => {
        const { data } = await axios.post<RKTestResponse>('http://localhost:4663/td_test/rk', payload);
        return data;
    });

export const useHeringtonTest = () =>
    useMutation('testHerington', async (payload: TestRequest) => {
        const { data } = await axios.post<HeringtonTestResponse>('http://localhost:4663/td_test/herington', payload);
        return data;
    });

export const useFredenslundTest = () =>
    useMutation('testFredenslund', async (payload: FredenslundTestRequest) => {
        const { data } = await axios.post<FredenslundTestResponse>(
            'http://localhost:4663/td_test/fredenslund',
            payload,
        );
        return data;
    });
