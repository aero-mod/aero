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

export type PatchReplacment = {
    match: string | RegExp;
    replace: string | ((...args: string[]) => string);
    predicate?(): boolean;
};

export type Patch = {
    find: string;
    replacement: PatchReplacment[] | PatchReplacment;
    all?: boolean;
    ignoreWarnings?: boolean;
    predicate?(): boolean;
    _active?: boolean;
};

export enum SettingsItemTypes {
    BOOLEAN = "boolean",
    NUMBER = "number",
    STRING = "string",
}

type SettingsOption = {
    id: string;
    name: string;
    description: string;
    type: SettingsItemTypes;
};

export type Author<T = string> = {
    name: string;
    id?: T;
};

export type Plugin = {
    id: string;
    name: string;
    description: string;
    settings?: SettingsOption[];
    author: Author | Author[];
    dependencies?: string[];
    self?: Record<string, unknown>;
    patches?: Patch[];
    start?(): void;
    stop?(): void;
    color?: string;
};

export type AgentPlugin = Plugin & {
    agent?: true;
    builtin: true;
    color: "var(--aero-brand)";
};

export type VencordPlugin = {
    name: string;
    description: string;
    authors: Author<bigint>[];
    start?(): void;
    stop?(): void;
    patches?: {
        find: string;
        replacement: PatchReplacment[] | PatchReplacment;
        all?: boolean;
        noWarn?: boolean;
        predicate?(): boolean;
    }[];
    /**
     * @deprecated - Vencord functionality not implemented in aero.
     */
    commands?: unknown[];
    /**
     * @deprecated - Vencord functionality not implemented in aero.
     */
    dependencies?: string[];
    /**
     * @deprecated - Vencord functionality not implemented in aero.
     */
    required?: boolean;
    /**
     * @deprecated - Vencord functionality not implemented in aero.
     */
    enabledByDefault?: boolean;
    /**
     * @deprecated - Vencord functionality not implemented in aero.
     */
    settings?: unknown;
    /**
     * @deprecated - Vencord functionality not implemented in aero.
     */
    beforeSave?(options: Record<string, unknown>): (true | string) | PromiseLike<true | string>;
    /**
     * @deprecated - Vencord functionality not implemented in aero.
     */
    settingsAboutComponent?: React.ComponentType<{
        tempSettings?: Record<string, unknown>;
    }>;
    /**
     * @deprecated - Vencord functionality not implemented in aero.
     */
    flux?: {
        [E: string]: (event: unknown) => void;
    };
    /**
     * @deprecated - Vencord functionality not implemented in aero.
     */
    toolboxActions?: Record<string, () => void>;
    /**
     * @deprecated - Vencord functionality not implemented in aero.
     */
    tags?: string[];
    [key: string]: unknown;
};

export type AnyPlugin = Plugin | AgentPlugin | VencordPlugin;

export type AeroPlugin = Plugin | AgentPlugin;

export const definePlugin = (plugin: Plugin): Plugin => plugin;

export const defineVencordPlugin = (plugin: VencordPlugin): VencordPlugin => plugin;
