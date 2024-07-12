import { ChildProcessWithoutNullStreams, exec, spawn } from 'child_process';
import { app } from 'electron';
import path from 'node:path';

const SERVER_EXE = 'VLizard_server.exe';
let child: ChildProcessWithoutNullStreams | undefined;

// child process is started and PID persisted in child, unless we can't acquire lock, which means VLizard is already running
export const startPyServer = (isInstanceLocked: boolean) => {
    if (!isInstanceLocked) return;

    // in order to test the functionality in dev mode:
    // child = spawn(path.join(__dirname, '..', '..', 'appPy', 'dist', SERVER_EXE), []); return;
    if (!app.isPackaged || child) return;
    const exePath = path.join(process.resourcesPath, SERVER_EXE);
    child = spawn(exePath, [], { cwd: process.resourcesPath });
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
    if (isInstanceLocked) exec(`taskkill /F /IM ${SERVER_EXE} /T`);
    process.exit(0);
};
