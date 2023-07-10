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

import { _MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "../webpack/common/components";
import External from "~/renderer/ui/components/Icons/External";
import { AgentPlugin, SettingsItemType } from "./types";
import { OPEN_SNIPPET_DIRECTORY } from "~/common/ipc";
import { pluginSettings } from "./settings";
import { patch } from "../patcher/menu";
import { getModule } from "../webpack";

export const contextMenu: AgentPlugin = {
    color: "var(--aero-brand)",
    agent: true,
    builtin: true,
    author: {
        name: "TheCommieAxolotl",
        id: "538487970408300544",
    },
    id: "aero_contextMenu",
    name: "Context Menu",
    description: "Context menu utilities.",
    patches: [
        {
            find: "♫ (つ｡◕‿‿◕｡)つ ♪",
            replacement: {
                match: /(?=var .{1,2},.{1,2}=.{1,2}\.navId)/,
                replace: "aero.contextMenu._patchContext(e);",
            },
        },
    ],
};

export const qol: AgentPlugin = {
    color: "var(--aero-brand)",
    builtin: true,
    author: {
        name: "TheCommieAxolotl",
        id: "538487970408300544",
    },
    id: "aero_qol",
    name: "Quality of Life",
    description: "Includes various quality of life improvements.",
    start() {
        patch("settings", "user-settings-cog", (children) => {
            const settingsActions = getModule(["updateAccount", "open", "setSection"]);

            if (!children[0]) return;

            if (children[0][6] && children[0][6].key === null) return;

            children[0].splice(
                6,
                0,
                <_MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.MenuItem label="Aero" id="aero">
                    <_MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.MenuGroup>
                        <_MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.MenuItem
                            action={() => {
                                settingsActions.open("aero");
                            }}
                            label="Dashboard"
                            id="aero-dashboard"
                        />
                        <_MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.MenuItem
                            action={() => {
                                settingsActions.open("addons");
                            }}
                            label="Addons"
                            id="aero-addons"
                        />
                        <_MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.MenuItem
                            label="Snippets"
                            id="aero-snippets"
                            icon={External}
                            action={() => {
                                window.aeroNative.ipc.invoke(OPEN_SNIPPET_DIRECTORY);
                            }}
                        />
                    </_MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.MenuGroup>
                </_MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.MenuItem>
            );
        });
    },
    self: {
        makeInfoElements: (
            Component: (props: { children: unknown; [key: string]: unknown }) => React.JSX.Element,
            props: unknown[]
        ) => {
            return (
                <>
                    <Component {...props}>
                        Aero {window.aeroNative.version} ({window.aeroNative.channel})
                    </Component>
                    <Component {...props}>Electron {window.aeroNative.native.versions.electron}</Component>
                    <Component {...props}>Chrome {window.aeroNative.native.versions.chrome}</Component>
                </>
            );
        },
    },
    patches: [
        {
            find: ".versionHash",
            replacement: [
                {
                    match: /\[\(0,.{1,3}\.jsxs?\)\((.{1,10}),(\{[^{}}]+\{.{0,20}.versionHash,.+?\})\)," "/,
                    replace: (m, component, props) => {
                        props = props.replace(/children:\[.+\]/, "");
                        return `${m},$self.makeInfoElements(${component},${props})`;
                    },
                },
                {
                    match: '.foreground,"aria-hidden":!0})})]})}',
                    replace: `.foreground,"aria-hidden":!0})}), 
window.aero.webpack.common.React.createElement("a", {
    href: "https://github.com/aero-mod",
    className: "aero-infoVersion",
    target: "_blank",
    rel: "noreferrer noopener"
}, window.aero.webpack.common.React.createElement("svg", {
  width: "14",
  height: "14",
  viewBox: "0 0 282 283",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, window.aero.webpack.common.React.createElement("path", {
  d: "M53.7594 268.44L51.1478 273.673C48.2834 279.392 42.4493 283 36.0677 283H16.8805C4.34886 283 -3.80198 269.791 1.80041 258.565L12.3102 237.506C25.4737 248.605 39.3111 258.945 53.7384 268.44H53.7594Z",
  fill: "currentColor"
}), window.aero.webpack.common.React.createElement("path", {
  d: "M263.975 281.924C253.782 281.164 243.693 279.983 233.752 278.4L156.329 123.284C150.116 110.835 132.403 110.835 126.19 123.284L79.3913 217.059C65.0484 207.267 51.4215 196.485 38.595 184.858L112.837 36.1149L126.19 9.33732C132.403 -3.11244 150.116 -3.11244 156.329 9.33732L280.193 257.51C286.027 269.179 276.97 282.895 263.975 281.903V281.924Z",
  fill: "currentColor"
})))]})}`,
                },
            ],
        },
    ],
};

export const doNotTrack: AgentPlugin = {
    color: "var(--aero-brand)",
    agent: true,
    builtin: true,
    author: {
        name: "TheCommieAxolotl",
        id: "538487970408300544",
    },
    id: "aero_doNotTrack",
    name: "Do Not Track",
    description: "Prevents Discord from tracking you in a number of locations.",
    patches: [
        {
            find: "TRACKING_URL:",
            replacement: [
                {
                    match: /^.+$/,
                    replace: "()=>{}",
                },
            ],
        },
        {
            find: "window.DiscordSentry=",
            replacement: [
                {
                    match: /^.+$/,
                    replace: "()=>{}",
                },
            ],
        },
        {
            find: ".METRICS,",
            replacement: [
                {
                    match: /this\._intervalId.+?12e4\)/,
                    replace: "",
                },
                {
                    match: /(?<=increment=function\(\i\){)/,
                    replace: "return;",
                },
            ],
        },
    ],
};

const loadingTextSettings = pluginSettings("aero_loadingText");

const ARR = [
    "Crabs quickly learn to avoid painful experiences",
    "If Aero breaks, blame Kevin",
    "You've opened Discord at least one time today",
];

// different on each startup, but stays the same during the session
const r = Math.floor(Math.random() * ARR.length);

export const loadingText: AgentPlugin = {
    color: "var(--aero-brand)",
    builtin: true,
    id: "aero_loadingText",
    name: "Loading Text",
    description: "Changes the text that appears on the loading screen.",
    settings: [
        {
            id: "showText",
            name: "Change Text",
            description: "Change the text that appears on the loading screen.",
            type: SettingsItemType.BOOLEAN,
            initialValue: true,
        },
        {
            id: "showTitle",
            name: "Change Title",
            description: "Changes the 'Did you know' text to show your version of Aero.",
            type: SettingsItemType.BOOLEAN,
            initialValue: true,
        },
        {
            id: "customText",
            name: "Custom Text",
            description: "Custom text to show on the loading screen.",
            type: SettingsItemType.STRING,
        },
    ],
    author: {
        name: "TheCommieAxolotl",
        id: "538487970408300544",
    },
    self: {
        provideText(old: string) {
            if (loadingTextSettings["customText"]) return loadingTextSettings["customText"];

            if (!loadingTextSettings["showText"]) return old;

            return ARR[r];
        },
    },
    patches: [
        {
            find: "this._loadingText,",
            replacement: [
                {
                    match: "this._loadingText,",
                    replace: "$self.provideText(),",
                },
            ],
        },
        {
            find: ".Messages.LOADING_DID_YOU_KNOW",
            replacement: {
                match: /(\w{1,2}\.\w{1,2}\.Messages\.LOADING_DID_YOU_KNOW)/,
                replace: !loadingTextSettings["showTitle"]
                    ? `"Aero ${window.aeroNative.version}${
                          window.aeroNative.channel !== "production" ? ` (${window.aeroNative.channel})` : ""
                      }"`
                    : "$1",
            },
        },
    ],
};
