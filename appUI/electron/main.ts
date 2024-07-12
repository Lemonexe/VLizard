import { app, BrowserWindow, shell } from 'electron';
import path from 'node:path';
import { killAll, killPyServer, startPyServer } from './child.ts';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
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
            // Enable all CORS. Better here than BE, which has to be secure against outside calls, but for FE it doesn't matter.
            webSecurity: false,
        },
    });

    // Open external links (such as GitHub) using the default browser via shell; internal links (such as reload page) are opened in the Electron browser.
    win.webContents.on('will-navigate', (event, url) => {
        if (!win) return;
        const rootUrl = getRootUrl(win.webContents.getURL());
        if (!url.includes(rootUrl)) {
            event.preventDefault();
            shell.openExternal(url).then();
        }
    });

    const hash = isInstanceLocked ? '' : '#/no-lock';
    VITE_DEV_SERVER_URL ? win.loadURL(VITE_DEV_SERVER_URL + hash) : win.loadFile(BUILD_INDEX_URL + hash);
};

// START UP
app.whenReady().then(() => {
    startPyServer(isInstanceLocked);
    createWindow();
});

// SHUTDOWN
app.on('will-quit', killPyServer);
app.on('window-all-closed', () => killAll(isInstanceLocked));
app.on('quit', () => killAll(isInstanceLocked));
process.on('SIGINT', () => killAll(isInstanceLocked));
process.on('SIGTERM', () => killAll(isInstanceLocked));
