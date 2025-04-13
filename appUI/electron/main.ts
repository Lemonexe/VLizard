import { app, BrowserWindow, globalShortcut, ipcMain, shell } from 'electron';
import path from 'node:path';
import { URL } from 'node:url';
import { killAll, killPyServer, startPyServer } from './child.ts';
import { allowedOrigins } from './config.ts';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │

process.env.DIST = path.join(__dirname, '../dist');
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

const isInstanceLocked = app.requestSingleInstanceLock();
let win: BrowserWindow | undefined;
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
const BUILD_INDEX_URL = path.join(process.env.DIST, 'index.html');

// Parse the URL to extract the protocol and hostname
const getRootUrl = (fullUrl: string) => {
    const { protocol, hostname } = new URL(fullUrl);
    return `${protocol}//${hostname}`;
};

const createWindow = () => {
    win = new BrowserWindow({
        width: 1280,
        height: 1024,
        icon: path.join(process.env.PUBLIC, 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            // Enable all CORS. Better here than BE, which has to be secure against outside calls, but for FE it doesn't matter.
            webSecurity: false,
        },
    });

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL).then();
    } else {
        win.loadFile(BUILD_INDEX_URL).then();
    }

    // Open external links (such as GitHub) using the default browser via shell; internal links (such as reload page) are opened in the Electron browser.
    win.webContents.on('will-navigate', (event, url) => {
        if (!win) return;
        const rootUrl = getRootUrl(win.webContents.getURL());
        if (!url.includes(rootUrl)) {
            const { origin } = new URL(url);

            event.preventDefault();
            if (!allowedOrigins.has(origin)) return console.warn(`Blocked client request to unknown origin: ${origin}`);
            shell.openExternal(url).then();
        }
    });

    globalShortcut.register('F12', () => win?.webContents.toggleDevTools());

    ipcMain.handle('request-instance-lock', () => isInstanceLocked);
};

// START UP
app.whenReady().then(() => {
    startPyServer(isInstanceLocked);
    createWindow();
});

// SHUTDOWN
app.on('will-quit', killPyServer);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
    killAll(isInstanceLocked);
});
app.on('quit', () => killAll(isInstanceLocked));
process.on('SIGINT', () => killAll(isInstanceLocked));
process.on('SIGTERM', () => killAll(isInstanceLocked));
