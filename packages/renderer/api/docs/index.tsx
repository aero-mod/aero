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

import { LayerActions } from "../webpack/common/actions";
import markdown from "~/renderer/util/markdown";
import { c } from "~/renderer/util/classes";
import { getModule } from "../webpack";

import CloseButton from "~/renderer/ui/components/Modal/CloseButton";

import plugin from "~content/docs/plugins/index.md";

import "./index.scss";

export const openDocumentationPageWithString = (content: string) => {
    LayerActions.pushLayer(() => (
        <div className={c("docs-page", getModule(["markup"]).markup)}>
            <div className="absolute-close-button">
                <CloseButton onClick={() => LayerActions.popLayer()} />
            </div>
            {markdown(content, false, {
                allowHeading: true,
                allowLinks: true,
                allowList: true,
            })}
        </div>
    ));
};

export const openByName = (name: "plugin") => {
    switch (name) {
        case "plugin":
            openDocumentationPageWithString(plugin);
            break;
        default:
            break;
    }
};
