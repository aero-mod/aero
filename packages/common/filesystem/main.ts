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
    basePath: string;
    tree: Directory;

    constructor(basePath: string) {
        this.basePath = basePath;

        this.tree = this.buildTree(basePath);

        this.attachListener(basePath);
    }

    attachListener(basePath: string) {
        fs.watch(basePath, () => {
            // TODO: handle file system events
        });
    }

    buildTree(basePath: string): Directory {
        const files = fs.readdirSync(basePath, { withFileTypes: true });

        const tree: Directory = {
            type: "directory",
            relativePath: "/",
            absolutePath: basePath,
            files: [],
            directories: [],
            name: basePath.split("/").pop(),
        };

        for (const file of files) {
            if (file.isFile()) {
                const content = fs.readFileSync(`${basePath}/${file.name}`, "utf8");

                tree.files.push({
                    type: "file",
                    relativePath: `/${file.name}`,
                    absolutePath: `${basePath}/${file.name}`,
                    content,
                    filename: file.name,
                    extension: file.name.split(".").pop(),
                });
            } else if (file.isDirectory()) {
                tree.directories.push(this.buildTree(path.join(basePath, file.name)));
            }
        }

        return tree;
    }

    getFile(relativePath: string): File | undefined {
        const pathParts = relativePath
            .split("/")
            .filter((p) => p !== "")
            .slice(0, -1);

        let currentDirectory = this.tree;

        for (const part of pathParts) {
            const directory = currentDirectory.directories.find((d) => d.name === part);

            if (!directory) return undefined;

            currentDirectory = directory;
        }

        const file = currentDirectory.files.find((f) => f.filename === relativePath.split("/").pop());

        if (!file) return undefined;

        return file;
    }

    writeFile(relativePath: string, content: string) {
        const existingFile = this.getFile(relativePath);

        if (existingFile) {
            existingFile.content = content;

            fs.writeFileSync(existingFile.absolutePath, content);

            return true;
        }

        const pathParts = relativePath
            .split("/")
            .filter((p) => p !== "")
            .slice(0, -1);

        let currentDirectory = this.tree;

        for (const part of pathParts) {
            const directory = currentDirectory.directories.find((d) => d.name === part);

            if (!directory) {
                currentDirectory.directories.push({
                    type: "directory",
                    relativePath: `${currentDirectory.relativePath}/${part}`,
                    absolutePath: path.join(currentDirectory.absolutePath, part),
                    files: [],
                    directories: [],
                    name: part,
                });

                fs.mkdirSync(path.join(currentDirectory.absolutePath, part));

                currentDirectory = currentDirectory.directories[currentDirectory.directories.length - 1];
            } else {
                currentDirectory = directory;
            }
        }

        const filename = relativePath.split("/").pop();

        const newFile: File = {
            type: "file",
            relativePath,
            absolutePath: path.join(currentDirectory.absolutePath, filename),
            content,
            filename,
            extension: filename.split(".").pop(),
        };

        currentDirectory.files.push(newFile);

        fs.writeFileSync(newFile.absolutePath, content);
    }

    getDirectory(relativePath: string): Directory | undefined {
        const pathParts = relativePath.split("/").filter((p) => p !== "");

        let currentDirectory = this.tree;

        for (const part of pathParts) {
            const directory = currentDirectory.directories.find((d) => d.name === part);

            if (!directory) return undefined;

            currentDirectory = directory;
        }

        return currentDirectory;
    }

    createDirectory(relativePath: string) {
        const existingDirectory = this.getDirectory(relativePath);

        if (existingDirectory) return false;

        const pathParts = relativePath
            .split("/")
            .filter((p) => p !== "")
            .slice(0, -1);

        let currentDirectory = this.tree;

        for (const part of pathParts) {
            const directory = currentDirectory.directories.find((d) => d.name === part);

            if (!directory) {
                currentDirectory.directories.push({
                    type: "directory",
                    relativePath: `${currentDirectory.relativePath}/${part}`,
                    absolutePath: path.join(currentDirectory.absolutePath, part),
                    files: [],
                    directories: [],
                    name: part,
                });

                currentDirectory = currentDirectory.directories[currentDirectory.directories.length - 1];
            } else {
                currentDirectory = directory;
            }
        }

        const name = relativePath.split("/").pop();

        const newDirectory: Directory = {
            type: "directory",
            relativePath,
            absolutePath: path.join(currentDirectory.absolutePath, name),
            files: [],
            directories: [],
            name,
        };

        currentDirectory.directories.push(newDirectory);

        fs.mkdirSync(newDirectory.absolutePath);

        return true;
    }
}

export const makeFs = (fileSystem: FileSystem) => {
    return {
        readFile: (path: string) => {
            const file = fileSystem.getFile(path);

            if (!file) throw new Error(`File not found: ${path}`);

            return file.content;
        },
        readdir: (path: string) => {
            const directory = fileSystem.getDirectory(path);

            if (!directory) throw new Error(`Directory not found: ${path}`);

            return [...directory.files.map((f) => f.filename), ...directory.directories.map((d) => d.name)];
        },
        mkdir: (path: string) => {
            if (path.includes("../")) throw new Error(`Invalid path: ${path}`);
            if (path.includes("..\\")) throw new Error(`Invalid path: ${path}`);

            return fileSystem.createDirectory(path);
        },
        exists: (path: string) => {
            const file = fileSystem.getFile(path);
            const directory = fileSystem.getDirectory(path);

            return !!file || !!directory;
        },
        path: {
            join: (...paths: string[]) => {
                return path.join(...paths);
            },
            resolveToAbsolute: (relativePath: string) => {
                // we can assume that we want the leading slash to be removed

                return path.resolve(
                    fileSystem.basePath,
                    relativePath.startsWith("/") ? relativePath.slice(1) : relativePath
                );
            },
        },
    };
};
