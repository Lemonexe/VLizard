import { AxiosError } from 'axios';

export const getApiErrorMessage = (e: unknown) => {
    if (e instanceof AxiosError) return e.response?.data?.message ?? e.message;
    if (e instanceof Error) return e.message;
    return String(e);
};
