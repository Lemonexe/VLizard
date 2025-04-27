import { build, createServer } from 'vite';

const mode = 'development';
process.env.NODE_ENV = mode;

const rendererWatchServer = await createServer({
    mode,
    configFile: 'vite.config.renderer.ts',
});

await rendererWatchServer.listen();

const rendererWatchServerProvider = {
    name: 'renderer-watch-server-provider',
    api: { provideRendererWatchServer: () => rendererWatchServer },
};

await build({
    mode,
    configFile: 'vite.config.preload.ts',
    plugins: [rendererWatchServerProvider],
});

await build({
    mode,
    configFile: 'vite.config.main.ts',
    plugins: [rendererWatchServerProvider],
});
