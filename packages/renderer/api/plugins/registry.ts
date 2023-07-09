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

import { Patch, AnyPlugin, AeroPlugin, VencordPlugin, PatchReplacment } from "./types";
import { startPlugin, stopPlugin } from "./actions";
import { EnabledAddonStore } from "../stores";
import { loadSettings } from "../settings";
import logger from "~/common/logger";

const enabled = new Set<string>();

export const patches: (Patch & {
    pluginID: string;
    replacement: PatchReplacment[];
})[] = [];

export const plugins: Record<string, AeroPlugin> = {};

EnabledAddonStore.addListener((val) => {
    for (const [p, value] of Object.entries(val.plugins)) {
        const plugin = Object.values(plugins).find((plugin) => plugin.id === p);

        if (!plugin) continue;

        if (value) {
            if (enabled.has(p)) continue;

            enabled.add(p);

            startPlugin(plugin);
        }

        if (!value) {
            enabled.delete(p);

            stopPlugin(plugin);
        }
    }
});

export const toAero = (plugin: AnyPlugin): AeroPlugin => {
    try {
        if (plugin["id"]) return plugin as AeroPlugin;

        const venPlugin = plugin as VencordPlugin;

        const aeroplugin: AeroPlugin = {
            id: venPlugin.name.toLowerCase().replace(/ /g, "_"),
            name: venPlugin.name,
            author: venPlugin.authors.map((author) => ({
                name: author.name,
                id: author.id?.toString(),
            })),
            description: venPlugin.description,
            patches: venPlugin.patches?.map((patch) => ({
                find: patch.find,
                replacement: Array.isArray(patch.replacement) ? patch.replacement : [patch.replacement],
                active: false,
                all: patch.all,
                ignoreWarnings: patch.noWarn,
                predicate: patch.predicate,
            })),
            color: "var(--aero-brand)",
        };

        return aeroplugin;
    } catch (e) {
        return null;
    }
};

export const registerPlugin = (plugin: AeroPlugin) => {
    const aeroPlugin = toAero(plugin);

    if (!aeroPlugin) throw new Error("Invalid plugin, could not convert to AeroPlugin");

    plugins[aeroPlugin.id] = aeroPlugin;

    if (loadSettings().enabledAddons.plugins[aeroPlugin.id] || aeroPlugin["agent"]) {
        logger.debug(`Starting patches for ${aeroPlugin.name}`);

        if (plugin.patches) {
            for (const patch of plugin.patches) {
                patches.push({
                    ...patch,
                    replacement: Array.isArray(patch.replacement) ? patch.replacement : [patch.replacement],
                    pluginID: aeroPlugin.id,
                });
            }
        }
    }
};
