import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: './', // important for packaged app, because the index.html is not in the root of file://
    build: {
        minify: false,
        outDir: 'dist',
        target: 'chrome136', // https://www.electronjs.org/blog/electron-36-0#stack-changes
    },
    plugins: [react()],
    define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
});
