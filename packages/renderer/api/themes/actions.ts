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

import { h, themes } from "~/renderer/api/dom";
import { loadCSS } from "./external";
import settings from "../settings";
import { Theme } from "./types";

const escape = (str: string) => `aero-t-${str.replace(/\W/g, "-")}`;

const cssCache = new Map<string, string>();

export const toggleTheme = (theme: Theme) => {
    settings.enabledAddons = {
        ...window.aero.settings.enabledAddons,
        themes: {
            ...window.aero.settings.enabledAddons.themes,
            [theme.id]: !window.aero.settings.enabledAddons.themes[theme.id],
        },
    };
};

export const startTheme = (theme: Theme) => {
    const style = h("style");

    style.id = escape(theme.id);

    if (cssCache.has(theme.id)) {
        style.innerHTML = cssCache.get(theme.id);
    } else {
        const css = loadCSS(theme);

        style.innerHTML = css;

        cssCache.set(theme.id, css);
    }

    themes.appendChild(style);

    document.body.classList.add(escape(theme.id));
};

export const stopTheme = (theme: Theme) => {
    const style = document.getElementById(escape(theme.id));

    if (style) style.remove();

    document.body.classList.remove(escape(theme.id));
};

export const enableRemoteTheme = async (url: string) => {
    const style = `@import url("${url}");`;

    const id = `remote-${escape(url.split("/").pop())}`;

    const styleEl = h("style");

    styleEl.id = id;

    styleEl.innerHTML = style;

    themes.appendChild(styleEl);
};

export const disableRemoteTheme = (url: string) => {
    const style = document.getElementById(`remote-${escape(url.split("/").pop())}`);

    if (style) style.remove();
};
