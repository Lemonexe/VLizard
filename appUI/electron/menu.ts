import { Menu, MenuItemConstructorOptions, shell } from 'electron';
// hacky import from electron-renderer src
import { BUG_TRACKING_URL, LICENSE_URL, MANUAL_URL } from '../src/adapters/io/URL.ts';

const template: MenuItemConstructorOptions[] = [
    {
        label: 'Window',
        submenu: [
            { role: 'quit' },
            { role: 'minimize' },
            { role: 'reload' },
            { role: 'toggleDevTools' },
            { role: 'togglefullscreen' },
            { type: 'separator' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { role: 'resetZoom' },
        ],
    },
    {
        label: 'Help',
        submenu: [
            { label: 'Getting started', click: () => shell.openExternal(MANUAL_URL) },
            { label: 'Bug report', click: () => shell.openExternal(BUG_TRACKING_URL) },
            { label: 'License', click: () => shell.openExternal(LICENSE_URL) },
        ],
    },
];

export const createAppMenu = () => Menu.setApplicationMenu(Menu.buildFromTemplate(template));
