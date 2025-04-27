import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        emptyOutDir: false,
        minify: false,
        ssr: true,
        outDir: 'dist-electron',
        assetsDir: '.',
        target: 'chrome134',
        lib: {
            entry: ['electron/preload.ts'],
            // ESM not supported for sandboxed & isolated preload https://www.electronjs.org/docs/latest/tutorial/esm#summary-esm-support-matrix
            formats: ['cjs'],
        },
        rollupOptions: {
            input: undefined, // don't parse index.html
            external: [],
        },
    },
    publicDir: false,
});
