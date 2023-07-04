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

import { showModal, showReloadDialog } from "~/renderer/api/notifications";
import { OPEN_PLUGIN_DIRECTORY, OPEN_THEME_DIRECTORY } from "~/common/ipc";
import { EnabledAddonStore, useStore } from "~/renderer/api/stores";
import { React, components } from "~/renderer/api/webpack/common";
import { togglePlugin } from "~/renderer/api/plugins/actions";
import useSettings from "~/renderer/api/settings/useSettings";
import { toggleTheme } from "~/renderer/api/themes/actions";
import { AeroPlugin } from "~/renderer/api/plugins/types";
import { Theme } from "~/renderer/api/themes/types";
import { openByName } from "~/renderer/api/docs";
import { plugins } from "~/renderer/api/plugins";
import { themes } from "~/renderer/api/themes";

import { ModalContent, ModalFooter, ModalHeader, ModalSize } from "../../components/Modal";
import Button, { ButtonColor, ButtonSize } from "../../components/Button";
import PanelButton from "../../components/PanelButton";
import FormTitle from "../../components/FormTitle";
import AddonCard from "../../components/AddonCard";
import TextInput from "../../components/TextInput";
import Folder from "../../components/Icons/Folder";
import Pencil from "../../components/Icons/Pencil";
import Plus from "../../components/Icons/Plus";
import Info from "../../components/Icons/Info";
import Book from "../../components/Icons/Book";
import Alert from "../../components/Alert";

import "./addons.scss";

export default () => {
    const [section, setSection] = React.useState<"plugins" | "themes">("plugins");
    const [url, setUrl] = React.useState("");

    const enabled = useStore(EnabledAddonStore);

    const [settings, setSettings] = useSettings();

    const makeSetter = <T extends "plugins" | "themes">(type: T, addon: T extends "plugins" ? AeroPlugin : Theme) => {
        return () => {
            if (type === "plugins") {
                togglePlugin(addon as AeroPlugin);

                if ((addon as AeroPlugin).patches.length) {
                    showReloadDialog();
                }
            } else {
                toggleTheme(addon as Theme);
            }
        };
    };

    return (
        <div id="aero-addons">
            <FormTitle level={1}>Addons</FormTitle>
            {settings().loadThirdParty ? (
                <></>
            ) : (
                <Alert
                    className="mb-2"
                    header="External Addons are currently disabled"
                    type="warning"
                    details="If this is unexpected, please enable them in Aero settings."
                />
            )}
            <div className="tab-bar" role="tablist" aria-orientation="horizontal">
                <div className="tab-bar-options">
                    <div
                        className={`tab ${section === "plugins" ? "active" : ""}`}
                        onClick={() => setSection("plugins")}
                    >
                        Plugins
                    </div>
                    <div className={`tab ${section === "themes" ? "active" : ""}`} onClick={() => setSection("themes")}>
                        Themes
                    </div>
                </div>
                <div className="tab-bar-menu">
                    {section === "plugins" ? (
                        <>
                            <PanelButton
                                tooltipText="Add Remote Plugin"
                                onClick={() => {
                                    showModal(
                                        (close) => (
                                            <>
                                                <ModalHeader center>
                                                    <FormTitle nomargin level={1}>
                                                        Add Remote Plugin
                                                    </FormTitle>
                                                </ModalHeader>
                                                <ModalContent>
                                                    <TextInput
                                                        placeholder="Plugin URL"
                                                        value={url}
                                                        type="text"
                                                        onChange={(value) => {
                                                            setUrl(value);
                                                        }}
                                                    />
                                                </ModalContent>
                                                <ModalFooter gap>
                                                    <Button
                                                        fullwidth
                                                        size={ButtonSize.LARGE}
                                                        color={ButtonColor.BRAND}
                                                        onClick={
                                                            // TODO: Add remote plugin
                                                            close
                                                        }
                                                    >
                                                        Add
                                                    </Button>
                                                    <Button
                                                        fullwidth
                                                        onClick={close}
                                                        size={ButtonSize.LARGE}
                                                        color={ButtonColor.PRIMARY}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </ModalFooter>
                                            </>
                                        ),
                                        ModalSize.Small
                                    );
                                }}
                            >
                                <Plus />
                            </PanelButton>
                            <PanelButton
                                tooltipText="Open Plugins"
                                onClick={() => {
                                    window.aeroNative.ipc.invoke(OPEN_PLUGIN_DIRECTORY);
                                }}
                            >
                                <Folder />
                            </PanelButton>
                            <PanelButton
                                tooltipText="Documentation"
                                onClick={() => {
                                    openByName("plugin");
                                }}
                            >
                                <Book />
                            </PanelButton>
                        </>
                    ) : (
                        <>
                            <PanelButton
                                tooltipText="Edit Theme URLs"
                                onClick={() => {
                                    showModal(
                                        (close) => (
                                            <>
                                                <ModalHeader center>
                                                    <FormTitle nomargin level={1}>
                                                        Quick Theme URLs
                                                    </FormTitle>
                                                </ModalHeader>
                                                <ModalContent>
                                                    <textarea
                                                        className="textarea"
                                                        placeholder="https://aero.github.io/themes/your-theme.css"
                                                        onChange={(e) => {
                                                            setSettings({
                                                                themeURLS: e.target.value,
                                                            });
                                                        }}
                                                        style={{ marginBottom: "1rem" }}
                                                    >
                                                        {settings().themeURLS}
                                                    </textarea>
                                                </ModalContent>
                                                <ModalFooter gap>
                                                    <Button
                                                        fullwidth
                                                        size={ButtonSize.LARGE}
                                                        color={ButtonColor.BRAND}
                                                        onClick={close}
                                                    >
                                                        Done
                                                    </Button>
                                                </ModalFooter>
                                            </>
                                        ),
                                        ModalSize.Small
                                    );
                                }}
                            >
                                <Pencil />
                            </PanelButton>
                            <PanelButton
                                tooltipText="Open Themes"
                                onClick={() => {
                                    window.aeroNative.ipc.invoke(OPEN_THEME_DIRECTORY);
                                }}
                            >
                                <Folder />
                            </PanelButton>
                        </>
                    )}
                </div>
            </div>
            <div className={`addons-container ${settings().loadThirdParty ? "" : "disabled"}`}>
                {section === "plugins" ? (
                    <>
                        <div className="addons-section">
                            {Object.values(plugins)
                                .filter((p) => !p["builtin"])
                                .map((plugin) => (
                                    <AddonCard
                                        plugin={plugin}
                                        enabled={enabled.plugins[plugin.id]}
                                        setEnabled={makeSetter("plugins", plugin)}
                                    />
                                ))}
                        </div>
                        <FormTitle level={4}>
                            Built-In Plugins{" "}
                            <components.Tooltip text="These plugins are required either to introduce core functionality or to provide a better experience.">
                                {(props) => <Info rest={props} />}
                            </components.Tooltip>
                        </FormTitle>
                        <div className="addons-section" id="builtin">
                            {Object.values(plugins)
                                .filter((p) => p["builtin"])
                                .map((plugin) => (
                                    <AddonCard
                                        plugin={plugin}
                                        enabled={enabled.plugins[plugin.id]}
                                        setEnabled={makeSetter("plugins", plugin)}
                                    />
                                ))}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="addons-section">
                            {Object.values(themes).map((theme) => (
                                <AddonCard
                                    theme={theme}
                                    enabled={enabled.themes[theme.id]}
                                    setEnabled={makeSetter("themes", theme)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
