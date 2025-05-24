import axios from 'axios';

import { PushNotification } from '../../../contexts/NotificationContext.tsx';

import { getApiErrorMessage } from './getApiErrorMessage.ts';

/**
 * Wrapper around axios.get that destructures data or handles errors to push a notification
 * @param url
 * @param description for error message
 * @param pushNotification
 */
export const axiosGetWithHandling = async <T>(
    url: string,
    pushNotification?: PushNotification,
    description?: string,
): Promise<T> => {
    try {
        const { data } = await axios.get<T>(url);
        return data;
    } catch (e) {
        const prefix = description ? `Error fetching ${description}: ` : '';
        pushNotification?.({ message: prefix + getApiErrorMessage(e), severity: 'error' });
        // rethrow to be caught by react-query
        throw e;
    }
};
