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

import { CompilerOptions, transpileModule, createProgram, CompilerHost, createCompilerHost, createSourceFile, WriteFileCallback, getPreEmitDiagnostics } from "typescript";
import { compileString } from "sass";
import electron from "electron";

import path from "node:path";
import fs from "node:fs";

import { makeFs, FileSystem } from "~/common/filesystem/main";
import { AeroNative } from "~/renderer/globals";
import * as ipc from "~/common/ipc";
import { dirname } from "./util";

import pkg from "../../package.json" assert { type: "json" };
import { File } from "~/common/filesystem/types";

if (process.env.AERO_PRELOAD) require(process.env.AERO_PRELOAD);

const AeroConfiguration = new FileSystem(process.env.DATA_PATH);

const libFiles = {} as {
    [key: string]: File;
}

const libs = dirname(require.resolve("typescript"))
for (const lib of fs.readdirSync(libs, { withFileTypes: true })) {
    if (lib.isFile() && lib.name.startsWith("lib.") && lib.name.endsWith(".d.ts")) {
        libFiles[lib.name] = {
            type: "file",
            relativePath: lib.name,
            absolutePath: "i dont care man this file doesnt exist",
            content: fs.readFileSync(path.join(libs, lib.name), "utf8"),
            filename: lib.name,
            extension: ".ts"
        }
    }
}

const defaultCompilerHost = createCompilerHost({});
// https://convincedcoder.com/2019/01/19/Processing-TypeScript-using-TypeScript/
function makeCompilerHost(fileSystem: FileSystem, writeFile: WriteFileCallback): CompilerHost {
    Object.assign(fileSystem.getDirectory("/").files, libFiles);

    return {
        getSourceFile: (fileName, languageVersionOrOptions) => {
            console.log("getSourceFile", fileName);
            return createSourceFile(fileName, fileSystem.getFile(fileName)?.content, languageVersionOrOptions);;
        },
        getDefaultLibFileName: () => "lib.esnext.full.d.ts", // we ignore compileroptions, target is always esnext.
        writeFile,
        getCurrentDirectory: () => fileSystem.basePath,
        readFile: (fileName) => fileSystem.getFile(fileName)?.content,
        fileExists: (fileName) => fileSystem.getFile(fileName) !== undefined,
        getCanonicalFileName: (fileName) => {
            return defaultCompilerHost.getCanonicalFileName(fileName);
        },
        useCaseSensitiveFileNames: () => {
            return defaultCompilerHost.useCaseSensitiveFileNames();
        },
        getNewLine: () => {
            return defaultCompilerHost.getNewLine();
        },
    };
}

function checkValidPath(path: string) {
    if (path.includes("../") || path.includes("..\\")) throw new Error(`Invalid path: ${path}`);
}

electron.contextBridge.exposeInMainWorld("aeroNative", {
    version: pkg.version,
    channel: process.env.AERO_CHANNEL as AeroNative["channel"],
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
        transpileProgram: (pathToDir: string, entryFile: string, compilerOptions: CompilerOptions) => {
            console.log(AeroConfiguration)
            try {

                checkValidPath(pathToDir);
                checkValidPath(entryFile);

                const writeFile: WriteFileCallback = (fileName, data) => {
                    console.log("writeFile", fileName, data);
                }
                const compilerHost = makeCompilerHost(AeroConfiguration.subFs(pathToDir), writeFile);

                const program = createProgram([entryFile], compilerOptions, compilerHost);
                const emitResult = program.emit(program.getSourceFile(entryFile), writeFile)
                const allDiagnostics = getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

                console.log("output", emitResult, allDiagnostics);
            } catch(e) {
                console.error(e);
            }
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
} satisfies AeroNative);

const styles = fs.readFileSync(path.join(__dirname, "renderer.css"), "utf8");
const script = fs.readFileSync(path.join(__dirname, "renderer.js"), "utf8");

electron.webFrame.insertCSS(styles);

electron.webFrame.executeJavaScript(
    `(async () => {try{${script}}catch(e){console.error(e)}})(window)\n\n//# sourceURL=aero:renderer`
);

//# sourceURL=aero:preload
