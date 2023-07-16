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

import { app } from "electron";

import { Settings } from "~/renderer/api/settings/useSettings";

import path from "node:path";
import fs from "node:fs";

export const dataDirectory = path.join(app.getPath("appData"), "aero");

const SETTINGS_FILE = path.join(dataDirectory, "settings.json");

export const readSettings = (): Partial<Settings> => {
    try {
        return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
    } catch {
        return {};
    }
};

export const updateSettings = (newPair: {
    [key in keyof Settings]: Settings[key];
}) => {
    fs.writeFileSync(
        SETTINGS_FILE,
        JSON.stringify(
            {
                ...readSettings(),
                ...newPair,
            },
            null,
            4
        )
    );
};
