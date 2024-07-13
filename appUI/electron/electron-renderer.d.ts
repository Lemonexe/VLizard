export {};

declare global {
    interface Window {
        electron: {
            getInstanceLock: () => Promise<boolean>;
        };
    }
}
