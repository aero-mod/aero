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

import { sleep } from "~/renderer/util/time";
import { waitFor } from "../webpack";

export let ReactSpring: typeof import("react-spring");
export let ReactDOM: typeof import("react-dom");
export let React: typeof import("react");

waitFor(["findDOMNode"], false).then((md) => {
    ReactDOM = md;
});

waitFor(["useState"], false).then((md) => {
    React = md;
});

waitFor(["useSpring"], false).then(async (md) => {
    ReactSpring = md;

    while (!window.aero.notifications._initialiseToasts) {
        await sleep(1);
    }

    window.aero.notifications._initialiseToasts();
});
