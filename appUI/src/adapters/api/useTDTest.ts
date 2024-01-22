import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import {
    FredenslundTestRequest,
    FredenslundTestResponse,
    GammaTestResponse,
    HeringtonTestResponse,
    RKTestResponse,
    SlopeTestResponse,
    TestRequest,
} from './types/TDTest.ts';
import { hostName } from './helpers/hostName.ts';

export const useGammaTest = () =>
    useMutation(['testGamma'], async (payload: TestRequest) => {
        const { data } = await axios.post<GammaTestResponse>(hostName + '/td_test/gamma', payload);
        return data;
    });

export const useSlopeTest = () =>
    useMutation(['testSlope'], async (payload: TestRequest) => {
        const { data } = await axios.post<SlopeTestResponse>(hostName + '/td_test/slope', payload);
        return data;
    });

export const useRKTest = () =>
    useMutation(['testRK'], async (payload: TestRequest) => {
        const { data } = await axios.post<RKTestResponse>(hostName + '/td_test/rk', payload);
        return data;
    });

export const useHeringtonTest = () =>
    useMutation(['testHerington'], async (payload: TestRequest) => {
        const { data } = await axios.post<HeringtonTestResponse>(hostName + '/td_test/herington', payload);
        return data;
    });

export const useFredenslundTest = () =>
    useMutation(['testFredenslund'], async (payload: FredenslundTestRequest) => {
        const { data } = await axios.post<FredenslundTestResponse>(hostName + '/td_test/fredenslund', payload);
        return data;
    });
