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
import { plugins } from "./registry";

export const pluginSettings = (pluginID: string) => {
    return new Proxy(
        {},
        {
            get(_, key: string) {
                const plugin = plugins[pluginID];

                if (!plugin) return null;

                const storage = localStorage.getItem(`aero:plugin:${pluginID}`);

                if (!storage) return plugin.settings.find((setting) => setting.id === key)?.initialValue ?? null;

                const parsed = JSON.parse(storage);

                if (parsed[key] === undefined)
                    return plugin.settings.find((setting) => setting.id === key)?.initialValue ?? null;

                return parsed[key];
            },
            set(_, key: string, value: unknown) {
                const storage = localStorage.getItem(`aero:plugin:${pluginID}`);

                if (!storage) {
                    localStorage.setItem(`aero:plugin:${pluginID}`, JSON.stringify({ [key]: value }));

                    return true;
                }

                const parsed = JSON.parse(storage);

                parsed[key] = value;

                localStorage.setItem(`aero:plugin:${pluginID}`, JSON.stringify(parsed));

                return true;
            },
            deleteProperty(_, key: string) {
                const storage = localStorage.getItem(`aero:plugin:${pluginID}`);

                if (!storage) return null;

                const parsed = JSON.parse(storage);

                delete parsed[key];

                localStorage.setItem(`aero:plugin:${pluginID}`, JSON.stringify(parsed));

                return true;
            },
        }
    );
};
