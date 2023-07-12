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

import { CompilerOptions } from "typescript";

import * as ipc from "~/common/ipc";

/* eslint-disable @typescript-eslint/no-explicit-any */

export type AeroNative = {
    version: string;
    channel: "development" | "production" | "preview";
    native: {
        versions: NodeJS.ProcessVersions;
    };
    fileSystem: ReturnType<typeof import("~/common/filesystem/main").makeFs>;
    ipc: {
        invoke: (channel: (typeof ipc)[keyof typeof ipc], ...args: unknown[]) => void;
    };
    external: {
        transpile: (
            code: string,
            filePath: string,
            compilerOptions: CompilerOptions
        ) => {
            outputText: string;
            sourceMapText: string;
        };
        transpileProgram: any;
        transpileCSS: (
            code: string,
            filePath: string
        ) => {
            outputText: string;
            sourceMap: SourceMap;
        };
    };
};

export type SourceMap = {
    file?: string;
    sourceRoot?: string;
    version: string;
    sources: string[];
    names: string[];
    sourcesContent?: string[];
    mappings: string;
};

declare global {
    interface Window {
        require: <T extends string>(
            id: string
        ) => "aero" extends T
            ? typeof import("~/renderer/aero").default
            : "aero/plugin" extends T
            ? {
                  definePlugin: typeof import("~/renderer/api/plugins/types").definePlugin;
                  defineVencordPlugin: typeof import("~/renderer/api/plugins/types").defineVencordPlugin;
                  SettingsItemTypes: typeof import("~/renderer/api/plugins/types").SettingsItemTypes;
              }
            : never;
        webpackChunkdiscord_app: any;
        aero: typeof import("~/renderer/aero").default;
        aeroNative: AeroNative;
        DiscordNative: any;
    }
}
