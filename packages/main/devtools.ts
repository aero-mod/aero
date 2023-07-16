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

import { session } from "electron";
import { unzip } from "fflate";

import fs from "node:fs/promises";
import { existsSync } from "fs";
import path from "node:path";

import { dataDirectory } from "./ipc";
import { get } from "./util/fetch";
import crx from "./util/crx";

export const unpack = async (buffer: ArrayBuffer, extDir: string) => {
    return new Promise<void>((resolve, reject) => {
        unzip(new Uint8Array(buffer), (err, files) => {
            if (err) {
                return void reject(err);
            }

            Promise.all(
                Object.keys(files).map(async (file) => {
                    if (file.startsWith("_metadata/")) return 0;
                    if (file.endsWith("/")) return void fs.mkdir(path.join(extDir, file), { recursive: true });

                    const pathElements = file.split("/");
                    const name = pathElements.pop();
                    const directories = pathElements.join("/");
                    const dir = path.join(extDir, directories);

                    if (directories) {
                        await fs.mkdir(dir, { recursive: true });
                    }

                    await fs.writeFile(path.join(dir, name), files[file]);
                })
            )
                .then(() => resolve())
                .catch((err) => {
                    fs.rm(extDir, { recursive: true, force: true });
                    reject(err);
                });
        });
    });
};

export default async () => {
    const ext = path.join(dataDirectory, "extensionCache");

    if (existsSync(ext)) {
        session.defaultSession.loadExtension(ext);

        return;
    }

    await fs.mkdir(ext);

    const url =
        "https://raw.githubusercontent.com/Vendicated/random-files/f6f550e4c58ac5f2012095a130406c2ab25b984d/fmkadmapgofadopljbjfkapdkoienihi.zip";

    const buffer = await get(url);

    await unpack(crx(buffer), ext);

    session.defaultSession.loadExtension(ext);
};
