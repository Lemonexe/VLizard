## Typescript frontend

Or `appUI` for short, is a Typescript application which provides a GUI for the [python backend](appPy.md).

It uses Electron runtime, Vite bundler, React framework, and MUI material library.

**Local dev** is done using Electron with Vite dev server and python backend server,  
while **build process** is done using Electron Forge to create an all-inclusive Electron app ~~where python backend runs silently~~.

Uses `npm` for dependency management, see [package.json](../appUI/package.json).

### Setup
⚠ Execute in `appUI` folder!

todo

```
cd appUI
npm i
```

### Local run
Electron dev app + vite dev server: `npm run dev`

### Build
**TODO** Build Electron app: `npm run build`

### Development
Run eslint: `npm run lint`  
Run prettier: `npm run prettier`
