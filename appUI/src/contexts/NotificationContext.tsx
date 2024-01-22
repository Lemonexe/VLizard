import { createContext, Dispatch, FC, PropsWithChildren, ReactNode, useCallback, useContext, useState } from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';

const AUTOHIDE_DURATION = 4000; // ms
const ERROR_DURATION = 10_000; // ms

const getDuration = (notification: Notification): number =>
    notification.severity === 'error' ? ERROR_DURATION : notification.duration || AUTOHIDE_DURATION;

export type Notification = {
    message: ReactNode;
    severity?: AlertColor;
    duration?: number;
};
export type PushNotification = Dispatch<Notification>;

export const NotificationContext = createContext<PushNotification | null>(null);

export const useNotifications = () => {
    const notificationContext = useContext(NotificationContext);
    if (!notificationContext) throw new Error('useNotifications must be used within a NotificationProvider');
    return notificationContext;
};

// window.setTimeout handle
let timeoutHandle: number | null = null;

export const NotificationProvider: FC<PropsWithChildren> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [notification, setNotification] = useState<Notification | null>(null);

    const pushNotification = useCallback((newNotification: Notification) => {
        setNotification(newNotification);
        setOpen(true);
        if (timeoutHandle) clearTimeout(timeoutHandle);
        timeoutHandle = window.setTimeout(() => setOpen(false), getDuration(newNotification));
    }, []);

    return (
        <NotificationContext.Provider value={pushNotification}>
            {children}
            <Snackbar open={open} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                <Alert severity={notification?.severity || 'info'}>{notification?.message}</Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};
