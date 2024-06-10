/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
    interface ProcessEnv {
        /**
         * See electron/main.ts for build structure
         */
        DIST: string;
        /** /dist/ or /public/ */
        PUBLIC: string;
    }
}
