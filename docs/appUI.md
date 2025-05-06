## Typescript frontend

Or `appUI` for short, is a Typescript application which provides a GUI for the [Python backend](appPy.md).

Uses `npm` for dependency management, see [package.json](../appUI/package.json).

It is mainly built upon Electron runtime, Electron-builder packager, Vite bundler, React framework, and MUI material library.

**Local dev** is done using Electron with Vite dev server, requiring the python backend server to be running,  
while **build process** is done using Electron-Builder to create an all-inclusive Electron app installer.
The installed app runs python backend silently as a child process.

### Setup
⚠ All commands shall be run in `appUI` directory!
```
cd appUI
npm i
```

### Local run
1. Run the [python backend](appPy.md#local-run) (any method)
2. `npm start` (runs electron dev app using vite dev server)

### Development
Unit tests: `npm run test`  
Typecheck: `npm run tsc`  
ESLint: `npm run lint`  
Prettier: `npm run prettier`

### Build
1. Build the [python backend](appPy.md#build), then go back to `appUI` dir.
2. Build Electron app: `npm run build`

#### Build for Windows
No more is needed.

#### Build for Linux

Two targets are supported: the recommended `.deb` and the portable `.tar.xz`
(may not run without installing unspecified additional dependencies).  
The portable app is a byproduct of the deb installer.
Though if you want to create it directly, skipping deb, add `--dir` parameter to `electron-builder`).  
Then package it as follows:
```
pushd release
tar -cJvf vlizard_2025.1.0_amd64.tar.xz --transform='s,^linux-unpacked,vlizard,' linux-unpacked
popd
```

#### Build for macOS
N/A, TODO.
