import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { useNotifyErrorMessage } from './helpers/getApiErrorMessage.ts';
import { hostName } from './helpers/hostName.ts';
import {
    FredenslundTestRequest,
    FredenslundTestResponse,
    GammaTestRequest,
    GammaTestResponse,
    HeringtonTestResponse,
    RKTestResponse,
    SlopeTestResponse,
    TestRequest,
    VanNessTestRequest,
    VanNessTestResponse,
} from './types/TDTestTypes.ts';

export const useGammaTest = () => {
    const onError = useNotifyErrorMessage();
    return useMutation({
        mutationFn: async (payload: GammaTestRequest) => {
            const { data } = await axios.post<GammaTestResponse>(hostName + '/td_test/gamma', payload);
            return data;
        },
        onError,
    });
};

export const useSlopeTest = () => {
    const onError = useNotifyErrorMessage();
    return useMutation({
        mutationFn: async (payload: TestRequest) => {
            const { data } = await axios.post<SlopeTestResponse>(hostName + '/td_test/slope', payload);
            return data;
        },
        onError,
    });
};

export const useRKTest = () => {
    const onError = useNotifyErrorMessage();
    return useMutation({
        mutationFn: async (payload: TestRequest) => {
            const { data } = await axios.post<RKTestResponse>(hostName + '/td_test/rk', payload);
            return data;
        },
        onError,
    });
};

export const useHeringtonTest = () => {
    const onError = useNotifyErrorMessage();
    return useMutation({
        mutationFn: async (payload: TestRequest) => {
            const { data } = await axios.post<HeringtonTestResponse>(hostName + '/td_test/herington', payload);
            return data;
        },
        onError,
    });
};

export const useFredenslundTest = () => {
    const onError = useNotifyErrorMessage();
    return useMutation({
        mutationFn: async (payload: FredenslundTestRequest) => {
            const { data } = await axios.post<FredenslundTestResponse>(hostName + '/td_test/fredenslund', payload);
            return data;
        },
        onError,
    });
};

export const useVanNessTest = () => {
    const onError = useNotifyErrorMessage();
    return useMutation({
        mutationFn: async (payload: VanNessTestRequest) => {
            const { data } = await axios.post<VanNessTestResponse>(hostName + '/td_test/van_ness', payload);
            return data;
        },
        onError,
    });
};
