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

/* eslint-disable no-console */

// @ts-check

import process from "node:process";
import path from "node:path";
import fs from "node:fs";

import { banner, getAppPath } from "./common.js";

const channel = process.argv[2] ?? "stable";

export const uninject = async () => {
    const appPath = await getAppPath(channel);

    console.log("");

    console.log(`Uninjecting Discord ${channel}...`);

    const asarPath = path.join(appPath, "app.asar");
    const newAsarPath = path.join(appPath, "app.old.asar");
    const patchedPath = path.join(appPath, "app");

    if (fs.existsSync(newAsarPath)) {
        await fs.promises.rename(newAsarPath, asarPath);
    }

    if (fs.existsSync(patchedPath)) {
        await fs.promises.rm(patchedPath, { recursive: true });
    }

    console.log("");

    console.log(`\u001b[1m\u001b[32mUninjected Discord ${channel} successfully.\u001b[0m`);
};

if (process.argv[1]?.endsWith("uninject.js")) {
    banner("uninject");

    await uninject();
}
