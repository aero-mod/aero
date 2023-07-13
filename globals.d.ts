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

/* eslint-disable @typescript-eslint/no-explicit-any */

export type AeroNative = typeof import("~/preload/index").aeroNative;
export type Aero = typeof import("~/renderer/aero").default;

export type SourceMap = {
    file?: string;
    sourceRoot?: string;
    version: string;
    sources: string[];
    names: string[];
    sourcesContent?: string[];
    mappings: string;
};

type RequireResult<T extends string> = "aero" extends T
    ? typeof import("~/renderer/aero").default
    : "aero/plugin" extends T
    ? {
          definePlugin: typeof import("~/renderer/api/plugins/types").definePlugin;
          defineVencordPlugin: typeof import("~/renderer/api/plugins/types").defineVencordPlugin;
          SettingsItemType: typeof import("~/renderer/api/plugins/types").SettingsItemType;
      }
    : "aero/theme" extends T
    ? {
          defineTheme: typeof import("~/renderer/api/themes/types").defineTheme;
      }
    : "aero/webpack" extends T
    ? typeof import("~/renderer/api/webpack")
    : "aero/dom" extends T
    ? typeof import("~/renderer/api/dom")
    : "aero/ui" extends T
    ? typeof import("~/renderer/ui/components")
    : "aero/badges" extends T
    ? typeof import("~/renderer/api/attachments/badges")
    : never;

type InternalModule = "aero" | "aero/plugin" | "aero/theme" | "aero/webpack" | "aero/dom" | "aero/ui" | "aero/badges";

declare global {
    interface Window {
        /**
         * This is not `NodeRequire`, this require function provides access to internal modules via plugins.
         *
         * *Do not use this explicitly*
         */
        require: <I extends InternalModule>(id: I) => RequireResult<I>;
        webpackChunkdiscord_app: any;
        DiscordNative: any;

        aeroNative: AeroNative;
        aero: Aero;
    }
}
