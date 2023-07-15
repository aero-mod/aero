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

import { ipcMain, shell, app } from "electron";

import path from "node:path";
import fs from "node:fs";

import * as ipc from "~/common/ipc";

export const dataDirectory = path.join(app.getPath("appData"), "aero");

process.env.DATA_PATH = dataDirectory;

if (!fs.existsSync(dataDirectory)) fs.mkdirSync(dataDirectory);
if (!fs.existsSync(path.join(dataDirectory, "snippets"))) fs.mkdirSync(path.join(dataDirectory, "snippets"));
if (!fs.existsSync(path.join(dataDirectory, "plugins"))) fs.mkdirSync(path.join(dataDirectory, "plugins"));
if (!fs.existsSync(path.join(dataDirectory, "themes"))) fs.mkdirSync(path.join(dataDirectory, "themes"));
if (!fs.existsSync(path.join(dataDirectory, "data"))) fs.mkdirSync(path.join(dataDirectory, "data"));

export default () => {
    ipcMain.handle(ipc.OPEN_SNIPPET_DIRECTORY, () => {
        shell.openPath(path.join(dataDirectory, "snippets"));
    });

    ipcMain.handle(ipc.OPEN_PLUGIN_DIRECTORY, () => {
        shell.openPath(path.join(dataDirectory, "plugins"));
    });

    ipcMain.handle(ipc.OPEN_THEME_DIRECTORY, () => {
        shell.openPath(path.join(dataDirectory, "themes"));
    });

    ipcMain.handle(ipc.OPEN_DATA_DIRECTORY, () => {
        shell.openPath(path.join(dataDirectory, "data"));
    });
};
