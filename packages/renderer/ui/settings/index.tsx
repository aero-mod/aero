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

import { waitFor } from "~/renderer/api/webpack";
import aero from "~/renderer/aero";

import ErrorBoundary from "../components/ErrorBoundary";
import Dashboard from "./panes/Dashboard";
import Snippets from "./panes/Snippets";
import Addons from "./panes/Addons";

import "./settings.scss";

const patcher = new aero.patcher("aero:settings");

export default async () => {
    const UserSettings = await waitFor((m) => m["default"]?.prototype?.getPredicateSections);

    patcher.after(
        UserSettings.prototype,
        "getPredicateSections",
        (
            _,
            ret: {
                section: string;
                label?: string;
                icon?: React.JSX.Element;
                className?: string;
                onClick?: (e: React.MouseEvent) => void;
                onContextMenu?: (e: React.MouseEvent) => void;
                element?: () => React.JSX.Element;
            }[] = []
        ) => {
            let location = ret.findIndex((s: { section: string }) => s.section.toLowerCase() == "discord nitro") - 2;

            if (location < 0) return;

            const insertSettingsPane = (section: {
                section: string;
                label?: string;
                icon?: React.JSX.Element;
                className?: string;
                onClick?: (e: React.MouseEvent) => void;
                onContextMenu?: (e: React.MouseEvent) => void;
                element?: () => React.JSX.Element;
            }) => {
                ret.splice(location, 0, section);
                location++;
            };

            insertSettingsPane({ section: "DIVIDER" });
            insertSettingsPane({ section: "HEADER", label: "Aero" });

            insertSettingsPane({
                section: "aero",
                label: "Dashboard",
                element: () => (
                    <ErrorBoundary>
                        <Dashboard />
                    </ErrorBoundary>
                ),
            });

            insertSettingsPane({
                section: "addons",
                label: "Addons",
                element: () => (
                    <ErrorBoundary>
                        <Addons />
                    </ErrorBoundary>
                ),
            });

            insertSettingsPane({
                section: "snippets",
                label: "Snippets",
                element: () => (
                    <ErrorBoundary>
                        <Snippets />
                    </ErrorBoundary>
                ),
            });
        }
    );
};
