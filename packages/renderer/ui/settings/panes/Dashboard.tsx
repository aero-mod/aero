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

import { showReloadDialog } from "~/renderer/api/notifications";
import useSettings from "~/renderer/api/settings/useSettings";
import { components } from "~/renderer/api/webpack/common";
import { localStorage } from "~/renderer/util/polyfill";
import { Margin } from "~/renderer/util/classes";

import Button, { ButtonColor, ButtonLook, ButtonSize } from "../../components/Button";
import SettingsItem from "../../components/SettingsItem";
import FormTitle from "../../components/FormTitle";
import { Heart } from "../../components/Icons";

import "./dashboard.scss";

const milestone = (nextorLast: 1 | -1, count: number) => {
    const milestones = [0, 50, 100, 500, 1000, 2000];

    if (nextorLast === 1) {
        return milestones.find((milestone) => milestone > count) || 2000;
    } else {
        return (
            milestones
                .slice()
                .reverse()
                .find((milestone) => milestone < count) || 0
        );
    }
};

const getText = (count: number) => {
    if (count > 2000) return `${count} times!!! Now for that you get a cookie!`;

    if (count > 1000) return `You've opened Discord ${count} times! That's insane!`;

    if (count > 500) return `Woah, ${count} times? That's crazy!`;

    if (count > 100) return `${count} times? That's a lot!`;

    if (count > 50) return `Wow, you've opened Discord ${count} times!`;

    return `Pffft, ${count} times? That's nothing! Keep going!`;
};

const getEmoji = (count: number) => {
    if (count > 2000) return "🍪";

    if (count > 1000) return "🤯";

    if (count > 500) return "😮";

    if (count > 100) return "🥳";

    if (count > 50) return "😀";

    return "😴";
};

export default () => {
    const [settings, setSettings] = useSettings();

    const opened_discord = localStorage.getItem("aeroLaunches")
        ? parseInt(localStorage.getItem("aeroLaunches"), 36) || 0
        : 0;

    return (
        <div id="aero-dash">
            <FormTitle level={1}>Dashboard</FormTitle>
            <header className="dash-banner">
                <div className="dash-banner-left">
                    <div className="dash-banner-text">
                        You've opened Discord <span className="dash-banner-count">{opened_discord}</span> times with
                        Aero installed!
                    </div>
                    <div className="dash-banner-bar-wrapper">
                        <div className="dash-banner-bar">
                            <div
                                className="dash-banner-bar-fill"
                                style={{
                                    // @ts-expect-error css variable
                                    "--width": `${
                                        ((opened_discord - milestone(-1, opened_discord + 1)) /
                                            (milestone(1, opened_discord) - milestone(-1, opened_discord + 1))) *
                                        100
                                    }%`,
                                }}
                            />
                        </div>
                        <p
                            style={{
                                // @ts-expect-error css variable
                                "--progress": `${
                                    (1 -
                                        (opened_discord - milestone(-1, opened_discord + 1)) /
                                            (milestone(1, opened_discord) - milestone(-1, opened_discord + 1))) *
                                    100
                                }%`,
                                "--progress-px": `${
                                    (1 -
                                        (opened_discord - milestone(-1, opened_discord + 1)) /
                                            (milestone(1, opened_discord) - milestone(-1, opened_discord + 1))) *
                                    10
                                }px`,
                            }}
                        >
                            {getEmoji(milestone(1, opened_discord) + 1)}
                        </p>
                    </div>
                </div>
                <components.Tooltip text={getText(opened_discord)}>
                    {(props) => {
                        return (
                            <div {...props} className="dash-banner-right" tabIndex={0}>
                                {getEmoji(opened_discord)}
                            </div>
                        );
                    }}
                </components.Tooltip>
            </header>
            <FormTitle className={Margin.Top[4]} level={4}>
                Settings
            </FormTitle>
            <SettingsItem
                type="switch"
                value={settings().loadThirdParty}
                onChange={(value) => {
                    setSettings({ loadThirdParty: value });

                    showReloadDialog();
                }}
                title="Load Third-Party Addons"
                note={
                    "Loads addons specified under `/aero/plugins/` and `/aero/themes/`.\nBe careful with addons from untrusted sources."
                }
            />
            <SettingsItem
                type="switch"
                value={settings().debugLogs}
                onChange={(value) => {
                    setSettings({ debugLogs: value });
                }}
                title="Debug Logs"
                note={
                    "Sends debug logs to the console during runtime.\nThis is useful for debugging addons and themes."
                }
            />
            {window.DiscordNative.process.platform === "darwin" && (
                <SettingsItem
                    type="switch"
                    value={settings().vibrancy}
                    onChange={(value) => {
                        setSettings({ vibrancy: value });

                        showReloadDialog(true);
                    }}
                    title="Under-Window Vibrancy"
                    note={"Adds vibrancy to the window.\nThis is only available on macOS."}
                />
            )}
            <footer className="dash-footer">
                Please consider donating to Aero's development!
                <Button
                    color={ButtonColor.PRIMARY}
                    look={ButtonLook.OUTLINE}
                    size={ButtonSize.MEDIUM}
                    onClick={() => {
                        window.open("https://github.com/sponsors/TheCommieAxolotl");
                    }}
                >
                    <Heart fill="#db61a2" />
                    <span>Donate</span>
                </Button>
            </footer>
        </div>
    );
};
