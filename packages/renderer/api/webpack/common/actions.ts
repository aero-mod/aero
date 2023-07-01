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

import { Message } from "discord-types/general";
import type { ReactNode } from "react";

import { waitFor } from "../webpack";

import { Dispatcher } from "./misc";

export let MessageActions: {
    sendBotMessage: (channelId: string, content: string) => Message;
};

export const LayerActions = {
    pushLayer: (layer: () => ReactNode) => {
        Dispatcher.dispatch({
            type: "LAYER_PUSH",
            component: layer,
        });
    },
    popLayer: () => {
        Dispatcher.dispatch({
            type: "LAYER_POP",
        });
    },
    popAllLayers: () => {
        Dispatcher.dispatch({
            type: "LAYER_POP_ALL",
        });
    },
};

waitFor(["sendBotMessage"]).then((md) => {
    MessageActions = md;
});
