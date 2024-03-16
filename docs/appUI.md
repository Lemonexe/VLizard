## Typescript frontend

Or `appUI` for short, is a Typescript application which provides a GUI for the [Python backend](appPy.md).

It uses Electron runtime, Vite bundler, React framework, and MUI material library.

**Local dev** is done using Electron with Vite dev server and python backend server,  
while **build process** is done using Electron Forge to create an all-inclusive Electron app where python backend runs silently.

Uses `npm` for dependency management, see [package.json](../appUI/package.json).

### Setup
⚠ Execute in `appUI` folder!

```
cd appUI
npm i
```

### Build
1. Build the [python backend](appPy.md#build)
2. **TODO** Build Electron app: `npm run build`

### Local run
1. Run the [python backend](appPy.md#local-run)
2. Electron dev app + vite dev server: `npm run dev`

### Development
Run tsc: `npm run tsc`  
Run eslint: `npm run lint`  
Run prettier: `npm run prettier`
