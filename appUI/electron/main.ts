import { app, BrowserWindow, shell } from 'electron';
import { ChildProcessWithoutNullStreams, exec, spawn } from 'child_process';
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

let win: BrowserWindow | undefined;
let child: ChildProcessWithoutNullStreams | undefined;
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
const BUILD_INDEX_URL = path.join(process.env.DIST, 'index.html');

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
        event.preventDefault();
        shell.openExternal(url).then();
    });

    VITE_DEV_SERVER_URL ? win.loadURL(VITE_DEV_SERVER_URL) : win.loadFile(BUILD_INDEX_URL);
}

function startPyServer() {
    // in order to test the functionality in dev mode:
    // child = spawn('pipenv', ['run', 'start'], { cwd: path.join(__dirname, '..', '..', 'appPy'), shell: true }); return;
    // child = spawn(path.join(__dirname, '..', '..', 'appPy', 'dist', 'VLizard_server.exe'), []); return;
    if (!app.isPackaged || child) return;
    const exePath = path.join(process.resourcesPath, 'VLizard_server.exe');
    child = spawn(exePath, [], { cwd: process.resourcesPath });
}
function killPyServer() {
    if (!child) return;
    child.kill('SIGTERM');
    child.on('exit', () => {
        child = win = undefined;
    });
}
function killAll() {
    child = win = undefined;
    exec('taskkill /F /IM VLizard_server.exe /T'); // terminate with extreme prejudice!
    process.exit(0);
}

// START UP
app.whenReady().then(() => {
    startPyServer();
    createWindow();
});

// SHUTDOWN
app.on('before-quit', killPyServer);
app.on('will-quit', killPyServer);
app.on('window-all-closed', killAll);
app.on('quit', () => killAll);
process.on('SIGINT', killAll);
process.on('SIGTERM', killAll);
