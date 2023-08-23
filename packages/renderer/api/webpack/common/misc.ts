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

import { FluxDispatcher } from "discord-types/other";

import { waitFor } from "../webpack";

export let Dispatcher: FluxDispatcher;
export let hljs: typeof import("highlight.js");

waitFor(["subscribe", "dispatch", "register"]).then((md) => {
    Dispatcher = md;
});

waitFor(["highlight", "getLanguage"]).then((md) => {
    hljs = md;
});
