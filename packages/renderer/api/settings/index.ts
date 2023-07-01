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

import { localStorage } from "~/renderer/util/polyfill";
import type { Settings } from "./useSettings";

const listeners = new Set<[(settings: Settings) => void, keyof Settings]>();

let settings: Settings = {
    debugLogs: false,
    loadThirdParty: true,
    themeURLS: "",
    enabledAddons: {
        themes: {},
        plugins: {},
    },
};

export const saveSettings = (_settings: Partial<Settings>, noEmit?: boolean) => {
    const prev = { ...settings };

    settings = {
        ...settings,
        ..._settings,
    };

    localStorage.setItem(
        "aero-settings",
        JSON.stringify({
            ...settings,
            ..._settings,
        })
    );

    if (noEmit) return;

    for (const [listener, setting] of listeners) {
        if (setting === undefined || prev[setting] !== settings[setting]) {
            listener(settings);
        }
    }
};

export const observeSettings = (callback: (settings: Settings) => void, setting?: keyof Settings) => {
    listeners.add([callback, setting]);
};

export const loadSettings = () => {
    const prev = { ...settings };

    settings = JSON.parse(localStorage.getItem("aero-settings") || "{}");

    for (const key in settings) {
        if (key === "_update") continue;

        proxy[key] = settings[key];
    }

    for (const [listener, setting] of listeners) {
        if (setting === undefined || prev[setting] !== settings[setting]) {
            listener(settings);
        }
    }

    return settings;
};

export const proxy = new Proxy(settings, {
    set: <T extends keyof Settings>(_target, key: T, value: Settings[T]) => {
        saveSettings({
            [key as keyof Settings]: value,
        });

        Reflect.set(_target, key, value);

        return true;
    },
    get: (target, key, receiver) => {
        return Reflect.get(target, key, receiver);
    },
    deleteProperty: (target, key: keyof Settings) => {
        saveSettings({
            [key]: undefined,
        });

        return true;
    },
});

export default proxy;
