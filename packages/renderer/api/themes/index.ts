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

import { disableRemoteTheme, enableRemoteTheme, startTheme, stopTheme } from "./actions";
import { loadExternalThemes } from "./external";
import { EnabledAddonStore } from "../stores";
import { observeSettings } from "../settings";
import { Theme } from "./types";

const enabled = new Set<string>();

export const themes: Record<string, Theme> = {};
export const remoteThemes: Set<string> = new Set();

EnabledAddonStore.addListener((val) => {
    for (const [t, value] of Object.entries(val.themes)) {
        const theme = Object.values(themes).find((tme) => {
            return tme.id === t;
        });

        if (!theme) continue;

        if (value) {
            if (enabled.has(t)) continue;

            enabled.add(t);

            startTheme(theme);
        }

        if (!value) {
            enabled.delete(t);

            stopTheme(theme);
        }
    }
});

observeSettings((settings) => {
    const urls = settings.themeURLS?.split("\n").filter((url) => url.length > 0);

    if (!urls) return;

    for (const url of [...urls, ...remoteThemes]) {
        if (urls.includes(url)) {
            if (remoteThemes.has(url)) continue;

            remoteThemes.add(url);

            enableRemoteTheme(url);
        }

        if (!urls.includes(url)) {
            remoteThemes.delete(url);

            disableRemoteTheme(url);
        }
    }
}, "themeURLS");

export const validateTheme = (theme: Theme | unknown): Theme => {
    if (!theme) return null;

    if (!theme["id"]) return null;

    return theme as Theme;
};

export const registerTheme = (theme: Theme) => {
    const validTheme = validateTheme(theme);

    if (!validTheme) throw new Error("Invalid theme, could not validate");

    themes[theme.id] = validTheme;
};

export default () => {
    const external = loadExternalThemes();

    for (const theme of external) {
        registerTheme(theme);
    }
};
