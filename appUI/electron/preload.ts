import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    getInstanceLock: () => ipcRenderer.invoke('request-instance-lock'),
});
