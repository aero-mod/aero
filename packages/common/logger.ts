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

import { originalConsole } from "~/renderer/util/polyfill";
import { loadSettings } from "~/renderer/api/settings";

export const makeLogger = (prefix: string) => {
    return {
        log: (...args: unknown[]) => {
            originalConsole.log(`%c[${prefix}]`, "color: #7AA2F7", ...args);
        },
        info: (...args: unknown[]) => {
            originalConsole.log(`%c[${prefix}]`, "color: #7AA2F7", ...args);
        },
        warn: (...args: unknown[]) => {
            originalConsole.warn(`%c[${prefix}]`, "color: #e5c062", ...args);
        },
        error: (...args: unknown[]) => {
            originalConsole.error(`%c[${prefix}]`, "color: #e56269", ...args);
        },
        debug: async (...args: unknown[]) => {
            if (loadSettings().debugLogs) {
                originalConsole.log(`%c[${prefix}]`, "color: #7AA2F7", ...args);
            }
        },
    };
};

export default makeLogger("Aero");
