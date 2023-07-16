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

import { reapply, isStyle } from "../snippets";
import { React } from "../webpack/common";

const fs = window.aeroNative.fileSystem;

export interface Settings {
    debugLogs: boolean;
    loadThirdParty: boolean;
    themeURLS: string;
    vibrancy: boolean;
    enabledAddons: {
        themes: {
            [key: string]: boolean;
        };
        plugins: {
            [key: string]: boolean;
        };
    };
}

export default (): [() => Settings, (newSettings: Partial<Settings>) => void] => {
    const [_settings, setSettings] = React.useState<Settings>(window.aero.settings);

    return [
        () => _settings,
        (newSettings: Partial<Settings>) => {
            setSettings({ ..._settings, ...newSettings });

            for (const key in newSettings) {
                if (key === "_update") continue;

                window.aero.settings[key] = newSettings[key];
            }
        },
    ];
};

export const useSnippets = (): [
    () => {
        [key: string]: string;
    }
] => {
    const files = fs.readdir("/snippets");

    const [_snippetFiles] = React.useState<string[]>(files);

    const proxy = new Proxy(
        {},
        {
            get(_, prop: string) {
                if (prop === "_files") return _snippetFiles;

                return fs.readFile(`/snippets/${prop}`);
            },
            set(_, prop: string, value: string) {
                fs.writeFile(`/snippets/${prop}`, value);

                if (isStyle(prop)) reapply(prop);

                return true;
            },
            deleteProperty(_, prop: string) {
                fs.unlinkFile(`/snippets/${prop}`);

                if (isStyle(prop)) reapply(prop);

                return true;
            },
        }
    );

    return [() => proxy];
};
