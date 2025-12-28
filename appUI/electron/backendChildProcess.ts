import { ChildProcessWithoutNullStreams, exec, spawn } from 'child_process';
import { app } from 'electron';
import path from 'node:path';
import os from 'os';

let child: ChildProcessWithoutNullStreams | undefined;

const getBinaryFile = () => {
    const platform = os.platform();
    if (platform === 'win32') return 'VLizard_server.exe';
    if (platform === 'linux') return 'VLizard_server';
    if (platform === 'darwin') return 'VLizard_server';
    return '';
};

// start backend process & persist its PID in `child`, unless it's a secondary instance of VLizard (backend already running)
export const startPyServer = (isPrimaryInstance: boolean) => {
    if (!isPrimaryInstance) return;

    // in order to test spawning & killing in dev mode:
    // child = spawn(path.join('..', 'appPy', 'dist', getBinaryFile()), []);
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
export const killAll = (isPrimaryInstance: boolean) => {
    killPyServer();
    if (!app.isPackaged || !isPrimaryInstance || os.platform() !== 'win32') return;
    const binaryFile = getBinaryFile();
    exec(`taskkill /F /IM ${binaryFile} /T`);
    process.exit(0);
};
