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

import { Directory, File } from "./types";

import path from "node:path";
import fs from "node:fs";

export class FileSystem {
    #tree: Directory;
    #basePath: string;

    get basePath() {
        return this.#basePath;
    }

    get tree() {
        return this.#tree;
    }

    constructor(basePath: string) {
        this.#basePath = basePath;

        this.#tree = this.#buildTree(basePath);

        this.attachListener(basePath);
    }

    attachListener(basePath: string) {
        fs.watch(basePath, () => {
            // TODO: handle file system events
        });
    }

    #buildTree(basePath: string): Directory {
        const nodes = fs.readdirSync(basePath, { withFileTypes: true });

        const tree: Directory = {
            type: "directory",
            relativePath: "/",
            absolutePath: basePath,
            files: {},
            directories: {},
            name: basePath.split("/").pop(),
        };

        for (const node of nodes) {
            tree[node.isFile() ? "files" : "directories"][node.name] = node.isFile()
                ? {
                      type: "file",
                      relativePath: `/${node.name}`,
                      absolutePath: `${basePath}/${node.name}`,
                      content: fs.readFileSync(`${basePath}/${node.name}`, "utf8"),
                      filename: node.name,
                      extension: node.name.split(".").pop(),
                  }
                : this.#buildTree(path.join(basePath, node.name));
        }

        return tree;
    }

    #walkPath(relativePath: string | string[], createDirs?: boolean): Directory | undefined {
        if (!Array.isArray(relativePath)) relativePath = relativePath.split("/").filter((p) => p !== "");

        let currentDirectory = this.#tree;

        for (const part of relativePath) {
            if (!currentDirectory.directories[part]) {
                if (!createDirs) return undefined;

                currentDirectory.directories[part] = {
                    type: "directory",
                    relativePath: path.join(currentDirectory.relativePath, part),
                    absolutePath: path.join(currentDirectory.absolutePath, part),
                    files: {},
                    directories: {},
                    name: part,
                };

                fs.mkdirSync(currentDirectory.absolutePath);
            }
            currentDirectory = currentDirectory.directories[part];
        }
        return currentDirectory;
    }

    getFile(relativePath: string): File | undefined {
        const split = relativePath.split("/").filter((p) => p !== ""),
            filename = split.pop();
        return this.#walkPath(split)?.files[filename];
    }

    getDirectory(relativePath: string): Directory | undefined {
        return this.#walkPath(relativePath);
    }

    writeFile(relativePath: string, content: string) {
        const split = relativePath.split("/").filter((p) => p !== ""),
            filename = split.pop();

        const dir = this.#walkPath(split, true);
        if (dir.files[filename]) {
            dir.files[filename].content = content;
        } else {
            dir.files[filename] = {
                type: "file",
                relativePath,
                absolutePath: path.join(dir.absolutePath, filename),
                content,
                filename,
                extension: filename.split(".").pop(),
            };
        }

        fs.writeFileSync(dir.files[filename].absolutePath, content);
    }

    createDirectory(relativePath: string) {
        this.#walkPath(relativePath, true);
    }

    exists(relativePath: string) {
        const split = relativePath.split("/").filter((p) => p !== ""),
            name = split.pop(),
            dir = this.#walkPath(split);
        if (!dir) return false;
        return !!dir.files[name] || !!dir.directories[name];
    }

    isFile(relativePath: string) {
        return !!this.getFile(relativePath);
    }

    isDirectory(relativePath: string) {
        return !!this.getDirectory(relativePath);
    }

    unlink(relativePath: string, isFile: boolean) {
        const split = relativePath.split("/").filter((p) => p !== ""),
            name = split.pop();

        const sub = this.#walkPath(split)?.[isFile ? "files" : "directories"];
        if (!sub || !sub[name]) return;
        fs.unlinkSync(sub[name].absolutePath);
        delete sub[name];
    }
}

function checkValidPath(path: string) {
    if (path.includes("../")) throw new Error(`Invalid path: ${path}`);
    if (path.includes("..\\")) throw new Error(`Invalid path: ${path}`);
}

export const makeFs = (fileSystem: FileSystem) => {
    function isFile(path: string) {
        checkValidPath(path);
        return fileSystem.isFile(path);
    }

    function readFile(path: string) {
        checkValidPath(path);
        const file = fileSystem.getFile(path);

        if (!file) throw new Error(`File not found: ${path}`);

        return file.content;
    }

    function writeFile(path: string, content: string) {
        checkValidPath(path);
        return fileSystem.writeFile(path, content);
    }

    function unlinkFile(path: string) {
        checkValidPath(path);
        return fileSystem.unlink(path, true);
    }

    function readdir(path: string, withFileTypes: true): { name: string; isFile: boolean }[];
    function readdir(path: string, withFileTypes?: false | undefined): string[];
    function readdir(
        path: string,
        withFileTypes?: boolean | undefined
    ): string[] | { name: string; isFile: boolean }[] {
        checkValidPath(path);
        const dir = fileSystem.getDirectory(path);

        if (!dir) throw new Error(`Directory not found: ${path}`);

        return withFileTypes ? Object.keys(dir.files).map((name) => ({ name, isFile: true })) : Object.keys(dir.files);
    }

    function subdirs(path: string) {
        checkValidPath(path);
        const dir = fileSystem.getDirectory(path);

        if (!dir) throw new Error(`Directory not found: ${path}`);

        return Object.keys(dir.directories);
    }

    function getFiles(path: string) {
        checkValidPath(path);
        const dir = fileSystem.getDirectory(path);

        if (!dir) throw new Error(`Directory not found: ${path}`);

        return Object.keys(dir.files);
    }

    function mkdir(path: string) {
        checkValidPath(path);

        return fileSystem.createDirectory(path);
    }

    function unlinkDir(path: string) {
        checkValidPath(path);
        return fileSystem.unlink(path, false);
    }

    function exists(path: string) {
        checkValidPath(path);
        return fileSystem.exists(path);
    }

    function resolveToAbsolute(relativePath: string) {
        // we can assume that we want the leading slash to be removed

        return path.resolve(fileSystem.basePath, relativePath.startsWith("/") ? relativePath.slice(1) : relativePath);
    }

    return {
        exists,
        isFile,

        getFiles,
        readFile,
        writeFile,
        unlinkFile,

        subdirs,
        readdir,
        mkdir,
        unlinkDir,

        path: {
            join: path.join,
            extname: path.extname,
            resolveToAbsolute,
        },
    };
};
