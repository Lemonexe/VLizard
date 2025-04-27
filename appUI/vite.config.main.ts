import { defineConfig, Plugin } from 'vite';
import { ChildProcess, spawn } from 'child_process';
import electronPath from 'electron';

export default defineConfig({
    build: {
        emptyOutDir: false,
        minify: false,
        ssr: true,
        outDir: 'dist-electron',
        assetsDir: '.',
        target: 'node22',
        lib: {
            entry: 'electron/main.ts',
            formats: ['es'],
        },
        rollupOptions: {
            // don't parse index.html
            input: undefined,
            output: {
                entryFileNames: '[name].js',
            },
        },
    },
    publicDir: false,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    plugins: [electronPlugin()],
});

// plugin that handles starting Electron in dev mode as well as hot restarting it
function electronPlugin(): Plugin {
    let electronApp: ChildProcess | null = null;
    let rendererWatchServer = null;

    return {
        name: 'electron-plugin',

        config(config, env) {
            if (env.mode !== 'development') return;

            const plugins = config.plugins as Plugin[];
            const provider = plugins.find(({ name }) => name === 'renderer-watch-server-provider');
            if (!provider) throw new Error('Renderer watch server provider not found');

            rendererWatchServer = provider.api.provideRendererWatchServer();
            // so that electron-main can access it in dev mode
            process.env.VITE_DEV_SERVER_URL = rendererWatchServer.resolvedUrls.local[0];

            return { build: { watch: {} } };
        },

        writeBundle() {
            if (process.env.NODE_ENV !== 'development') return;

            // Kill electron if a process already exists
            if (electronApp !== null) {
                electronApp.removeListener('exit', process.exit);
                electronApp.kill('SIGINT');
                electronApp = null;
            }

            // Spawn a new electron process
            electronApp = spawn(String(electronPath), ['--inspect', '.'], { stdio: 'inherit' });

            // Stops the watch script when the application has been quit
            electronApp.addListener('exit', process.exit);
        },
    };
}
