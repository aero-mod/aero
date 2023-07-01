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

import { waitFor } from "../webpack";

import * as stores from "discord-types/stores";

export let DraftStore:
    | undefined
    | (stores.FluxStore & {
          getDraft: (channelId: string, draftType: number) => string;
      });
export let UserStore: undefined | stores.UserStore;
export let GuildStore: undefined | stores.GuildStore;
export let GuildMemberStore: undefined | stores.GuildMemberStore;
export let ChannelStore: undefined | stores.ChannelStore;
export let SelectedGuildStore: undefined | stores.SelectedGuildStore;
export let SelectedChannelStore: undefined | stores.SelectedChannelStore;

waitFor(["getDraft"]).then((md) => {
    DraftStore = md;
});

waitFor(["getUser", "getUsers"]).then((md) => {
    UserStore = md;
});

waitFor(["getGuild", "getGuildCount"]).then((md) => {
    GuildStore = md;
});

waitFor(["getMember", "getMembers"]).then((md) => {
    GuildMemberStore = md;
});

waitFor(["getChannel", "hasChannel"]).then((md) => {
    ChannelStore = md;
});

waitFor(["getGuildId", "getLastSelectedGuildId"]).then((md) => {
    SelectedGuildStore = md;
});

waitFor(["getChannelId", "getLastSelectedChannelId"]).then((md) => {
    SelectedChannelStore = md;
});
