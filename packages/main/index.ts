/**
 * This file is part of Aero, a next-generation Discord mod empowering users and developers alike.
 * Copyright (c) 2023 TheCommieAxolotl & contributors.
 *
 * Aero is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Aero is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Aero. If not, see <https://www.gnu.org/licenses/>.
 */

import type { BrowserWindowConstructorOptions } from "electron";

import electron from "electron";

import path from "node:path";

import { readSettings } from "./util/settings";
import devtools from "./devtools";
import ipc from "./ipc";
import csp from "./csp";

electron.app.commandLine.appendSwitch("no-force-async-hooks-checks");

electron.app.on("ready", () => {
    devtools();
    ipc();
    csp();
});

class BrowserWindow extends electron.BrowserWindow {
    constructor(options: BrowserWindowConstructorOptions) {
        if (!options.webPreferences || !options.webPreferences.preload || process.argv.includes("--vanilla")) {
            super(options);

            return;
        }

        const settings = readSettings();

        const originalPreload = options.webPreferences.preload;
        process.env.AERO_PRELOAD = originalPreload;

        const opts: BrowserWindowConstructorOptions = {
            ...options,
            webPreferences: {
                ...options.webPreferences,
                preload: path.join(__dirname, "preload.js"),
                devTools: true,
                nodeIntegration: true,
                contextIsolation: false,
            },
            ...(settings.vibrancy && process.platform === "darwin"
                ? {
                      vibrancy: "sidebar",
                      backgroundColor: "#00000000",
                  }
                : {}),
        };

        return super(opts) as unknown as BrowserWindow;
    }
}

const electronPath = require.resolve("electron");
delete require.cache[electronPath]?.exports;
require.cache[electronPath].exports = {
    ...electron,
    BrowserWindow,
};

const devToolsKey = "DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING";
if (!global.appSettings) global.appSettings = {};
if (!global.appSettings?.settings) global.appSettings.settings = {};
const oldSettings = global.appSettings.settings;
global.appSettings.settings = new Proxy(oldSettings, {
    get(target, prop) {
        if (prop === devToolsKey) return true;
        return target[prop];
    },
    set(target, prop, value) {
        if (prop === devToolsKey) return true;
        target[prop] = value;
        return true;
    },
});

//# sourceURL=aero:main
