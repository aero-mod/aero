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

import { loadExternalPlugins } from "./external";
export { pluginSettings } from "./settings";
import { startPlugin } from "./actions";
import * as builtin from "./builtin";

export * from "./registry";

import { registerPlugin } from "./registry";

export default async () => {
    const external = await loadExternalPlugins();

    for (const plugin of external) {
        registerPlugin(plugin);
    }
};

export const injectBuiltin = () => {
    for (const plugin of Object.values(builtin)) {
        registerPlugin(plugin);

        startPlugin(plugin);
    }
};
