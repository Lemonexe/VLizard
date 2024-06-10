## Typescript frontend

Or `appUI` for short, is a Typescript application which provides a GUI for the [Python backend](appPy.md).

Uses `npm` for dependency management, see [package.json](../appUI/package.json).

It is mainly built upon Electron runtime, Vite bundler, React framework, and MUI material library.

**Local dev** is done using Electron with Vite dev server and python backend server,  
while **build process** is done using Electron-Builder to create an all-inclusive Electron app installer.
The installed app runs python backend silently as a child process.

### Setup
⚠ All commands shall be run in `appUI` directory!
```
cd appUI
npm i
```

### Build
1. Build the [python backend](appPy.md#build)
2. Build Electron app: `npm run build`

### Local run
1. Run the [python backend](appPy.md#local-run)
2. Electron dev app + vite dev server: `npm start`

### Development
Unit tests: `npm run test`  
Typecheck: `npm run tsc`  
ESLint: `npm run lint`  
Prettier: `npm run prettier`
