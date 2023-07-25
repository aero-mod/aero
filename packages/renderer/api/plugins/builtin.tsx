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

import { Message, User } from "discord-types/general";

import { PartialUser, ProfileBadge, _getProfileBadges } from "../attachments/badges";
import { AgentPlugin, SettingsItemType } from "./types";
import { OPEN_SNIPPET_DIRECTORY } from "~/common/ipc";
import { UserStore } from "../webpack/common/stores";
import { showModal } from "../notifications";
import { pluginSettings } from "./settings";
import { patch } from "../patcher/menu";
import { getModule } from "../webpack";

import { ModalHeader, ModalContent, ModalCloseButton, ModalFooter, ModalSize } from "~/renderer/ui/components/Modal";
import { Tooltip, _MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "../webpack/common/components";
import Button, { ButtonColor, ButtonLook, ButtonSize } from "~/renderer/ui/components/Button";
import FormTitle from "~/renderer/ui/components/FormTitle";
import Heart from "~/renderer/ui/components/Icons/Heart";

export const contextMenu: AgentPlugin = {
    color: "var(--aero-brand)",
    agent: true,
    builtin: true,
    author: {
        name: "TheCommieAxolotl",
        id: "538487970408300544",
    },
    id: "aero_contextMenu",
    name: "Context Menu API",
    description: "Internal Context Menu API.",
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

const Badge = (props: { badge: ProfileBadge; user: PartialUser }) => {
    if (props.badge.component) {
        return (
            <Tooltip text={props.badge.tooltipText}>
                {({ onMouseEnter, onMouseLeave }: { onMouseEnter: () => void; onMouseLeave: () => void }) => {
                    const Component = props.badge.component;

                    return (
                        <div
                            className="aero-badge"
                            onClick={(e) => {
                                props.badge.onClick?.(e, props.user);
                            }}
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                        >
                            <Component user={props.user} />
                        </div>
                    );
                }}
            </Tooltip>
        );
    }
};

const internal = new Map<string, ProfileBadge[]>();

(async () => {
    const badges = (await (
        await fetch(
            "https://gist.githubusercontent.com/TheCommieAxolotl/58c22cb5e91c71ce85818395dbe80c24/raw/badges.json"
        )
    ).json()) as Record<string, { text: string; image: string; color: string }[]>;

    for (const [id, userBadges] of Object.entries(badges)) {
        for (const badge of userBadges) {
            internal.set(id, [
                ...(internal.get(id) ?? []),
                {
                    tooltipText: badge.text,
                    onClick: () => {
                        showModal(
                            (close) => (
                                <>
                                    <ModalHeader>
                                        <FormTitle noMargin level={1}>
                                            Donate to Aero
                                        </FormTitle>
                                        <ModalCloseButton onClick={close} />
                                    </ModalHeader>
                                    <ModalContent>
                                        <div className="donor-modal">
                                            The badge you clicked is a badge added by Aero. If you want a custom donor
                                            badge on your profile, click the button below to head over to my sponsor
                                            page.
                                        </div>
                                    </ModalContent>
                                    <ModalFooter transparent center>
                                        <Button
                                            color={ButtonColor.PRIMARY}
                                            look={ButtonLook.LINK}
                                            size={ButtonSize.MEDIUM}
                                            onClick={() => {
                                                window.open("https://github.com/sponsors/TheCommieAxolotl");
                                            }}
                                        >
                                            <Heart fill="#db61a2" />
                                            <span>Donate</span>
                                        </Button>
                                    </ModalFooter>
                                </>
                            ),
                            ModalSize.Small
                        );
                    },
                    component: () => (
                        <div className="aero-badge format aero-interactive">
                            {badge.image === ":aero_icon:" ? (
                                <svg width="16" height="16" viewBox="0 0 285 286" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill={badge.color}
                                        d="M54.2632 270.446L51.6271 275.718C48.7359 281.48 42.8471 285.115 36.4057 285.115H17.0387C4.38962 285.115 -3.83761 271.807 1.81728 260.497L12.4255 239.281C25.7124 250.463 39.6795 260.88 54.242 270.446H54.2632Z"
                                    />
                                    <path
                                        fill={badge.color}
                                        d="M266.449 284.031C256.16 283.265 245.977 282.075 235.943 280.481L157.795 124.206C151.523 111.663 133.644 111.663 127.373 124.206L80.1354 218.681C65.658 208.816 51.9035 197.953 38.9568 186.239L127.373 9.4071C133.644 -3.1357 151.523 -3.1357 157.795 9.4071L282.819 259.434C288.707 271.19 279.566 285.009 266.449 284.01V284.031Z"
                                    />
                                </svg>
                            ) : (
                                <img src={badge.image} />
                            )}
                        </div>
                    ),
                },
            ]);
        }
    }
})();

export const badges: AgentPlugin = {
    color: "var(--aero-brand)",
    agent: true,
    builtin: true,
    author: {
        name: "TheCommieAxolotl",
        id: "538487970408300544",
    },
    id: "aero_badges",
    name: "Badge API",
    description: "Internal Badge API.",
    self: {
        getBadgesForUser(
            props: {
                user: User;
            },
            children: unknown
        ) {
            const badges = [...(_getProfileBadges(props.user) || []), ...(internal.get(props.user.id) || [])];

            return [
                badges.map((badge) => {
                    return <Badge badge={badge} user={props.user} />;
                }),
                children,
            ];
        },
    },
    patches: [
        {
            find: ".Messages.PREMIUM_BADGE_TOOLTIP.format({",
            replacement: {
                match: /children:(.{1,2}\.map.+}\)}\)\)}},e\.id\)}\)\))/,
                replace: "children: $self.getBadgesForUser(e, $1)",
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
            find: "If someone told you to copy/paste something here you have an 11/10 chance you're being scammed.",
            replacement: [
                {
                    match: /If someone told you to copy\/paste something here you have an 11\/10 chance you're being scammed\./,
                    replace: "If you're reading this, you're probably smarter than most Discord developers.",
                },
                {
                    match: /Pasting anything in here could give attackers access to your Discord account\./,
                    replace: "Pasting anything in here could actually improve the Discord client.",
                },
                {
                    match: /Unless you understand exactly what you are doing, close this window and stay safe\./,
                    replace:
                        "Unless you understand exactly what you're doing, keep this window open to browse our bad code.",
                },
                {
                    match: /If you do understand exactly what you are doing, you should come work with us/,
                    replace: "If you don't understand exactly what you're doing, you should come work with us",
                },
            ],
        },
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
    href: "https://aero.icu",
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

export const utilityAttributes: AgentPlugin = {
    color: "var(--aero-brand)",
    builtin: true,
    id: "aero_utilityAttributes",
    name: "Utility Attributes",
    description: "Adds utility attributes to certain elements (Some themes require this plugin enabled).",
    author: {
        name: "TheCommieAxolotl",
        id: "538487970408300544",
    },
    self: {
        isAuthor(e: { message: Message }) {
            return e.message.author.id === UserStore.getCurrentUser().id;
        },
    },
    patches: [
        {
            find: '.THREAD_STARTER_MESSAGE,"Message',
            replacement: {
                match: /"aria-roledescription":.{1,2}\.Z\.Messages\.MESSAGE_A11Y_ROLE_DESCRIPTION,/,
                replace: (match) => {
                    return match + '"data-is-author-self": $self.isAuthor(e),';
                },
            },
        },
    ],
};
