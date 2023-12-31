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

export const contextMenuPatches: Record<string, { navId: string; callback: (children: React.ReactNode) => void }[]> =
    {};

export const patch = (pluginId: string, navId: string, callback: (children: React.ReactNode) => void) => {
    contextMenuPatches[pluginId] ??= [];

    contextMenuPatches[pluginId].push({ navId, callback });
};

export const unpatch = (pluginId: string) => {
    delete contextMenuPatches[pluginId];
};

export const _patchContext = (props: { navId: string; children: React.ReactNode }) => {
    for (const pluginId of Object.keys(contextMenuPatches)) {
        for (const { navId, callback } of contextMenuPatches[pluginId]) {
            if (navId !== props.navId) continue;

            callback(props.children);
        }
    }
};
