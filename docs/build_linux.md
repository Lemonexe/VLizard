## Build for Linux

Three targets are supported, but only `flatpak` is recommended and officially distributed.
1. Flatpak
2. portable `.tar.xz` _(may not run without installing unspecified additional dependencies)_
3. Debian apt package

### Flatpak build

Follow [general build instructions](appUI.md#build).

In order to build the flatpak installer, you may need to install: 
```
sudo apt install flatpak flatpak-builder
flatpak install --assumeyes runtime/org.freedesktop.Platform/x86_64/24.08
flatpak install --assumeyes runtime/org.freedesktop.Sdk/x86_64/24.08
flatpak install --assumeyes app/org.electronjs.Electron2.BaseApp/x86_64/24.08
```

Yields flatpak installer `./releases/VLizard_$VERSION-x86_64.flatpak`.

### Portable build

Unpacked portable app is available in `./releases/linux-unpacked/` as a byproduct of the flatpak build process.  
Package it as follows:
```
pushd release
tar -cJvf vlizard_2025.1.0_amd64.tar.xz --transform='s,^linux-unpacked,vlizard,' linux-unpacked
popd
```

Though if you want to **skip flatpak** build, you can prepare the unpacked portable app directly.  
Skip general build instructions, instead do the following:
1. Build the [python backend](appPy.md#build), then go back to `appUI` dir.
2. Build vite (main+preload): `build:vite-main`
3. Build vite (renderer): `build:vite-renderer`
4. Build Electron: `build:electron-portable`

### Debian package build
To build a Debian apt package, open `appUI/electron-builder.json5` and uncomment the line with `deb` target.  
Then follow [general build instructions](../README.md#build), nothing else should be needed.
