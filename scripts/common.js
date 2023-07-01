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
import os from "node:os";

export const known = {
    darwin: {
        stable: ["/Applications/Discord.app/Contents/Resources/"],
        canary: ["/Applications/Discord Canary.app/Contents/Resources/"],
        ptb: ["/Applications/Discord PTB.app/Contents/Resources/"],
    },
    win32: {
        stable: [path.join(os.homedir(), "AppData", "Local", "Discord")],
        canary: [path.join(os.homedir(), "AppData", "Local", "DiscordCanary")],
        ptb: [path.join(os.homedir(), "AppData", "Local", "DiscordPTB")],
    },
    linux: {
        stable: [
            path.join(os.homedir(), ".config", "discord"),
            "/usr/share/discord/resources/",
            "/usr/lib/discord/resources/",
            "/usr/opt/discord/resources/",
            "/opt/discord-stable/resouces",
        ],
        canary: [
            path.join(os.homedir(), ".config", "discordcanary"),
            "/usr/share/discordcanary/resources/",
            "/usr/lib/discordcanary/resources/",
            "/usr/opt/discordcanary/resources/",
            "/opt/discord-canary/resources",
        ],
        ptb: [
            path.join(os.homedir(), ".config", "discordptb"),
            "/usr/share/discordptb/resources/",
            "/usr/lib/discordptb/resources/",
            "/usr/opt/discordptb/resources/",
            "/opt/discord-ptb/resources",
        ],
    },
};

export const getAppPath = async (channel) => {
    const appPaths = known[process.platform]?.[channel] ?? [];

    for (const appPath of appPaths) {
        if (fs.existsSync(appPath)) {
            return appPath;
        }
    }

    throw new Error(`Could not find Discord ${channel} installation.`);
};

export const banner = (name) => {
    console.log(`\u001b[1m\u001b[32maero: ${name}\u001b[0m`);
};
