import { AxiosError } from 'axios';
import { useNotifications } from '../../../contexts/NotificationContext.tsx';

export const getApiErrorMessage = (e: unknown) => {
    if (e instanceof AxiosError) return e.response?.data?.message ?? e.message;
    if (e instanceof Error) return e.message;
    return String(e);
};

export const useNotifyErrorMessage = () => {
    const pushNotification = useNotifications();
    return (e: unknown) => pushNotification({ message: getApiErrorMessage(e), severity: 'error' });
};
