import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        minify: false
    },
    plugins: [
        react(),
        electron([
            {
                // Main-Process entry file of the Electron App.
                entry: 'electron/main.ts',
            },
            {
                entry: 'electron/preload.ts',
                // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete instead of restarting the entire Electron App.
                onstart: options => options.reload(),
            },
        ]),
        renderer(),
    ],
    define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
});
