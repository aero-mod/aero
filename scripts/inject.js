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

import { banner, channels, getAppPath } from "./common.js";
import { uninject } from "./uninject.js";

const safify = (str) => str.replace(/\\/g, "\\\\").replace("\\C:", "C:");

let channel = "<unknown>";
let customPath = null;
if (channels.includes(process.argv[2])) {
    channel = process.argv[2];
} else {
    customPath = process.argv[2];
}

const inject = async () => {
    const appPath = customPath ?? await getAppPath(channel);

    console.log("");

    console.log(`Injecting Discord ${channel}...`);

    const asarPath = path.join(appPath, "app.asar");
    const newAsarPath = path.join(appPath, "app.old.asar");
    const patchedPath = path.join(appPath, "app");

    if (fs.existsSync(patchedPath)) {
        console.log(`Discord ${channel} is already injected, attempting to uninject...`);

        console.log("");

        await uninject();

        console.log("");
    }

    if (!fs.existsSync(asarPath)) {
        throw new Error(`Could not find app.asar in Discord ${channel} installation.`);
    }

    await fs.promises.rename(asarPath, newAsarPath);

    await fs.promises.mkdir(patchedPath);

    await fs.promises.writeFile(
        path.join(patchedPath, "index.js"),
        `require("${safify(path.join(process.cwd(), "dist/main.js"))}")\n\nmodule.exports = require("${safify(
            newAsarPath
        )}");`
    );
    await fs.promises.writeFile(
        path.join(patchedPath, "package.json"),
        JSON.stringify({ name: "discord", main: "index.js" })
    );

    console.log("Successfully patched app.asar.");

    console.log("");

    console.log(`\u001b[1m\u001b[32mInjected Discord ${channel} successfully.\u001b[0m`);
};

if (process.argv[1]?.endsWith("inject.js")) {
    banner("inject");

    await inject();
}
