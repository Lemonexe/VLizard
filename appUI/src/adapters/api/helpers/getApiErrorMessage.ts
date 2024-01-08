import { AxiosError } from 'axios';
import { useNotifications } from '../../NotificationContext.tsx';

export const getApiErrorMessage = (e: unknown) => (e instanceof AxiosError ? e.response?.data.error ?? e : e);

export const useHandleApiError = () => {
    const pushNotification = useNotifications();
    return (e: unknown) => pushNotification({ message: getApiErrorMessage(e), severity: 'error' });
};
