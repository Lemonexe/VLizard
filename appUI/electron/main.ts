import { app, BrowserWindow, shell } from 'electron';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import path from 'node:path';

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

let win: BrowserWindow | null;
let child: ChildProcessWithoutNullStreams | undefined;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

// Parse the URL to extract the protocol and hostname
function getRootUrl(fullUrl: string) {
    const { protocol, hostname } = new URL(fullUrl);
    return `${protocol}//${hostname}`;
}

// Create main BrowserWindow
function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 1024,
        icon: path.join(process.env.PUBLIC, 'icon.png'),
        webPreferences: {
            // Enable all CORS. Better here than BE, which has to be secure against outside calls, but for FE it doesn't matter.
            webSecurity: false,
        },
    });

    // Open external link using the default browser instead of the Electron browser.
    win.webContents.on('will-navigate', (event, url) => {
        if (!win) return;
        const rootUrl = getRootUrl(win.webContents.getURL());
        if (!url.includes(rootUrl)) {
            event.preventDefault();
            shell.openExternal(url);
        }
    });

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL);
    } else {
        win.loadFile(path.join(process.env.DIST, 'index.html'));
    }
}

// Start python backend server
function startServer() {
    // only for the installed app, not for development
    if (!app.isPackaged) return;

    // const appPyPath = path.join(__dirname, '..', '..', 'appPy');
    // child = spawn('pipenv', ['run', 'start'], { cwd: appPyPath, shell: true });

    const exePath = path.join(process.resourcesPath, 'serve.exe');
    child = spawn(exePath, [], { cwd: process.resourcesPath });
}

app.on('quit', () => child?.kill());

app.on('window-all-closed', () => {
    win = null;
});

app.whenReady().then(() => {
    startServer();
    createWindow();
});
