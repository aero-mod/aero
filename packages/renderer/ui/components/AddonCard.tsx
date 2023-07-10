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

import { AeroPlugin, Author } from "~/renderer/api/plugins/types";
import { components } from "~/renderer/api/webpack/common";
import { showModal } from "~/renderer/api/notifications";
import buildSettings from "../settings/buildSettings";
import { Theme } from "~/renderer/api/themes/types";

import { ModalContent, ModalCloseButton, ModalHeader } from "./Modal";
import PanelButton from "./PanelButton";
import FormTitle from "./FormTitle";
import Gear from "./Icons/Gear";
import Switch from "./Switch";

import "./addoncard.scss";

const formatAuthors = (authors: Author[] | Author) => {
    if (!Array.isArray(authors) || authors.length == 1) {
        return Array.isArray(authors) ? authors[0].name : authors.name;
    }

    return authors
        .map((author, index) => {
            if (index == authors.length - 1) {
                return ` and ${author.name}`;
            }

            return `${index == 0 ? " " : ", "}${author.name}`;
        })
        .join("");
};

export default (
    props:
        | {
              enabled: boolean;
              setEnabled: (enabled: boolean) => void;
              plugin: AeroPlugin;
          }
        | {
              enabled: boolean;
              setEnabled: (enabled: boolean) => void;
              theme: Theme;
          }
) => {
    if (props["plugin"]) {
        const plugin = props["plugin"] as AeroPlugin;

        return (
            <div
                className={`addon-card ${plugin["agent"] ? "agent" : ""}`}
                style={{
                    // @ts-expect-error css variable
                    "--addon-accent": plugin.color || "var(--text-default)",
                }}
            >
                <div className="addon-card-accent" />
                <div className="addon-card-inner">
                    <div className="addon-card-header">
                        <div className="addon-card-text">
                            <div className="addon-card-name">{plugin.name}</div>
                            <div className="addon-card-description">{plugin.description}</div>
                        </div>
                        {!plugin["agent"] && (
                            <div className="addon-card-switch">
                                {plugin.settings && (
                                    <PanelButton
                                        disabled={!props.enabled}
                                        tooltipText="Settings"
                                        onClick={() => {
                                            showModal((close) => (
                                                <>
                                                    <ModalHeader separator>
                                                        <FormTitle nomargin level={1}>
                                                            {plugin.name} Settings
                                                        </FormTitle>
                                                        <ModalCloseButton onClick={close} />
                                                    </ModalHeader>
                                                    <ModalContent>{buildSettings(plugin)}</ModalContent>
                                                </>
                                            ));
                                        }}
                                    >
                                        <Gear />
                                    </PanelButton>
                                )}
                                <Switch value={props.enabled} onChange={(a) => props.setEnabled(a)} />
                            </div>
                        )}
                    </div>
                    <div className="addon-card-footer">
                        {plugin.patches?.length > 0 && (
                            <div className="addon-card-patches">
                                {plugin.patches.filter((p) => p._active).length > 0 && (
                                    <components.Tooltip
                                        text={`${plugin.patches.filter((p) => p._active).length} Active Patch${
                                            plugin.patches.filter((p) => p._active).length === 1 ? "" : "es"
                                        }`}
                                    >
                                        {(props) => (
                                            <div {...props} className="active">
                                                {plugin.patches.filter((p) => p._active).length} Active
                                            </div>
                                        )}
                                    </components.Tooltip>
                                )}
                                {plugin.patches.filter((p) => !p._active).length > 0 && (
                                    <components.Tooltip
                                        text={`${plugin.patches.filter((p) => !p._active).length} Inactive Patch${
                                            plugin.patches.filter((p) => !p._active).length === 1 ? "" : "es"
                                        }`}
                                    >
                                        {(props) => (
                                            <div {...props} className="inactive">
                                                {plugin.patches.filter((p) => !p._active).length} Inactive
                                            </div>
                                        )}
                                    </components.Tooltip>
                                )}
                            </div>
                        )}
                        <div className="addon-card-author">
                            <components.Tooltip text={`Created by ${formatAuthors(plugin.author)}`}>
                                {(props) => (
                                    <div {...props} className="author">
                                        {Array.isArray(plugin.author)
                                            ? plugin.author.map((a) => a.name).join(", ")
                                            : plugin.author.name}
                                    </div>
                                )}
                            </components.Tooltip>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (props["theme"]) {
        const theme = props["theme"] as Theme;

        return (
            <div
                className="addon-card"
                style={{
                    // @ts-expect-error css variable
                    "--addon-accent": theme.color,
                }}
            >
                <div className="addon-card-accent" />
                <div className="addon-card-inner">
                    <div className="addon-card-header">
                        <div className="addon-card-text">
                            <div className="addon-card-name">{theme.name}</div>
                            <div className="addon-card-description">{theme.description}</div>
                        </div>
                        <div className="addon-card-switch">
                            <Switch value={props.enabled} onChange={(a) => props.setEnabled(a)} />
                        </div>
                    </div>
                    <div className="addon-card-footer">
                        <div className="addon-card-author">
                            <components.Tooltip text={`Created by ${Array.isArray(theme.author)}`}>
                                {(props) => (
                                    <div {...props} className="author">
                                        {Array.isArray(theme.author)
                                            ? theme.author.map((a) => a.name).join(", ")
                                            : theme.author.name}
                                    </div>
                                )}
                            </components.Tooltip>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
