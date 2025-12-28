# Typescript/React frontend

Or `appUI` for short, is an Electron application written in Typescript, which provides a GUI for the [Python backend](appPy.md).  
Uses `npm` for dependency management, see [package.json](../appUI/package.json).

It is mainly built upon Electron runtime, Electron-builder packager, Vite bundler, React framework, and MUI material library.

**Local dev** is done using Electron with Vite dev server, requiring the python backend server to be running,  
while **build process** is done using Electron-Builder to create an all-inclusive Electron app installer.
The installed app runs python backend silently as a child process.

## Setup
⚠ All commands shall be run in `appUI` directory!
```
cd appUI
nvm i # or manually install nodeJS version as per the file .nvmrc
npm i
```

## Local run
1. Run the [python backend](appPy.md#local-run) (any method)
2. `npm start` (runs electron dev app using vite dev server)

## Development
Unit tests: `npm run test`  
Typecheck: `npm run tsc`  
ESLint: `npm run lint`  
Prettier: `npm run prettier`

## Build
1. Build the [python backend](appPy.md#build), then go back to `appUI` dir.
2. Build Electron app installer: `npm run build`

See notes on [Release](release.md).

### Build for Windows
Yields installer `.\releases\VLizard_$VERSION.exe`.  
Portable app is also available in `.\releases\win-unpacked\` as a byproduct of the installer build process, but it is not distributed.

### Build for Linux

See [separate document](./build_linux.md) that describes both supported targets (`flatpak`, `.tar.xz`).

### Build for macOS
N/A, TODO.
