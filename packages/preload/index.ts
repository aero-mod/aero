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

import { CompilerOptions, transpileModule } from "typescript";
import { compileString } from "sass";
import electron from "electron";

import path from "node:path";
import fs from "node:fs";

import { makeFs, FileSystem } from "~/common/filesystem/main";
import * as ipc from "~/common/ipc";
import { dirname } from "./util";

import pkg from "../../package.json" assert { type: "json" };

if (process.env.AERO_PRELOAD) require(process.env.AERO_PRELOAD);

const AeroConfiguration = new FileSystem(process.env.DATA_PATH);

export const aeroNative = {
    version: pkg.version,
    channel: process.env.AERO_CHANNEL as "development" | "production" | "preview",
    native: {
        versions: process.versions,
    },
    ipc: {
        invoke: (channel: (typeof ipc)[keyof typeof ipc], ...args: unknown[]) => {
            if (!Object.values(ipc).includes(channel)) throw new Error(`Invalid IPC channel: ${channel}`);

            electron.ipcRenderer.invoke(channel, ...args);
        },
    },
    fileSystem: makeFs(AeroConfiguration),
    external: {
        transpile: (code: string, filePath: string, compilerOptions: CompilerOptions) => {
            const result = transpileModule(code, {
                compilerOptions,
                fileName: filePath.split("/").pop(),
            });

            return {
                outputText: result.outputText,
                sourceMapText: result.sourceMapText,
            };
        },
        transpileCSS: (code: string, filePath: string) => {
            const result = compileString(code, {
                url: new URL(filePath, "file://"),
                sourceMap: true,
                sourceMapIncludeSources: true,
                importers: [
                    {
                        canonicalize(url) {
                            return new URL(url, "file://");
                        },
                        load(canonicalUrl) {
                            const relative = canonicalUrl.pathname;

                            const absolute = path.join(process.env.DATA_PATH, dirname(filePath), relative);

                            return {
                                contents: fs.readFileSync(absolute, "utf8"),
                                syntax: "scss",
                            };
                        },
                    },
                ],
            });

            return {
                outputText: result.css.toString(),
                sourceMap: result.sourceMap,
            };
        },
    },
};

electron.contextBridge.exposeInMainWorld("aeroNative", aeroNative);

const styles = fs.readFileSync(path.join(__dirname, "renderer.css"), "utf8");
const script = fs.readFileSync(path.join(__dirname, "renderer.js"), "utf8");

electron.webFrame.insertCSS(styles);

electron.webFrame.executeJavaScript(
    `(async () => {try{${script}}catch(e){console.error(e)}})(window)\n\n//# sourceURL=aero:renderer`
);

//# sourceURL=aero:preload
