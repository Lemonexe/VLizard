declare namespace NodeJS {
    interface ProcessEnv {
        DIST: string;
        PUBLIC: string;
        VITE_DEV_SERVER_URL: string;
    }
}
