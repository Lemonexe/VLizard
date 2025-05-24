import { AxiosError } from 'axios';

import { useNotifications } from '../../../contexts/NotificationContext.tsx';

/**
 * Returns the error response from an axios error or a generic error message
 * @param e caught error
 */
export const getApiErrorMessage = (e: unknown) => {
    if (e instanceof AxiosError) return e.response?.data?.error ?? e.message;
    if (e instanceof Error) return e.message;
    return String(e);
};

/**
 * Generates an onError option for mutations that pushes a notification with the error message
 */
export const useNotifyErrorMessage = () => {
    const pushNotification = useNotifications();
    return (e: unknown) => pushNotification({ message: getApiErrorMessage(e), severity: 'error' });
};
