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

import { globalPromise } from "./api/webpack";

import { definePlugin, defineVencordPlugin, SettingsItemType } from "./api/plugins/types";
import plugins, { injectBuiltin, pluginSettings } from "./api/plugins";
import polyfill, { localStorage } from "./util/polyfill";
import * as badges from "./api/attachments/badges";
import { defineTheme } from "./api/themes/types";
import * as components from "./ui/components";
import previewBanner from "./util/preview";
import * as webpack from "./api/webpack";
import snippets from "./api/snippets";
import logger from "../common/logger";
import settings from "./ui/settings";
import themes from "./api/themes";
import * as dom from "./api/dom";
import aero from "./aero";

import aeroSettings from "./api/settings";

import "./util.scss";

const wrap = <T = () => unknown | Promise<unknown>>(fn: T) => {
    try {
        // @ts-expect-error yes, i know
        return fn();
    } catch (e) {
        logger.error(e);
    }
};

// @ts-expect-error no typescript, this is not NodeRequire
window.require = (id: string) => {
    switch (id) {
        case "aero":
            return aero;
        case "aero/dom":
            return dom;
        case "aero/badges":
            return badges;
        case "aero/plugin":
            return {
                definePlugin,
                defineVencordPlugin,
                pluginSettings,
                SettingsItemType,
            };
        case "aero/webpack":
            return webpack;
        case "aero/theme":
            return {
                defineTheme,
            };
        case "aero/ui":
            return components;
        default:
            return undefined;
    }
};

const initialise = async () => {
    window.DiscordNative?.window.setDevtoolsCallbacks((_) => _);

    await globalPromise;

    window.aero = aero;

    Object.freeze(window.aero);

    wrap(settings);

    wrap(injectBuiltin);

    if (aeroSettings.loadThirdParty) {
        wrap(themes);
        wrap(plugins);
        wrap(snippets);
    }

    wrap(previewBanner);

    localStorage.setItem(
        "aeroLaunches",
        (localStorage.getItem("aeroLaunches") ? parseInt(localStorage.getItem("aeroLaunches"), 36) + 1 : 1).toString(36)
    );
};

try {
    polyfill();
    initialise();

    logger.debug("Initialised");
} catch (e) {
    logger.error(e);
}
