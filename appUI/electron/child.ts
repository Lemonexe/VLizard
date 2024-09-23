import { ChildProcessWithoutNullStreams, exec, spawn } from 'child_process';
import { app } from 'electron';
import path from 'node:path';
import os from 'os';

let child: ChildProcessWithoutNullStreams | undefined;

const getBinaryFile = () => {
    const platform = os.platform();
    if (platform === 'win32') return 'VLizard_server.exe';
    if (platform === 'linux') return 'VLizard_server';
    // if (platform === 'darwin') return 'macOS';
    return '';
};

// child process is started and PID persisted in child, unless we can't acquire lock, which means VLizard is already running
export const startPyServer = (isInstanceLocked: boolean) => {
    if (!isInstanceLocked) return;

    // in order to test the functionality in dev mode:
    // child = spawn(path.join(__dirname, '..', '..', 'appPy', 'dist', getBinaryFile()), []); return;
    if (!app.isPackaged || child) return;

    const binaryFile = getBinaryFile();
    const binaryPath = path.join(process.resourcesPath, binaryFile);
    child = spawn(binaryPath, [], { cwd: process.resourcesPath });
};

// try to kill child process (only for this VLizard instance)
export const killPyServer = () => {
    if (!child) return;
    child.kill('SIGTERM');
    child.on('exit', () => {
        child = undefined;
    });
};

// terminate with extreme prejudice! It's the only thing that works on Windows. UGH!
export const killAll = (isInstanceLocked: boolean) => {
    killPyServer();
    if (!app.isPackaged || !isInstanceLocked || os.platform() !== 'win32') return;
    const binaryFile = getBinaryFile();
    exec(`taskkill /F /IM ${binaryFile} /T`);
    process.exit(0);
};
