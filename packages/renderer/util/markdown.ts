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

import type { ReactNode } from "react";

import { getModule } from "~/renderer/api/webpack";

import logger from "../../common/logger";

let mdModule: Record<
    | "parse"
    | "parseTopic"
    | "parseEmbedTitle"
    | "parseInlineReply"
    | "parseGuildVerificationFormRule"
    | "parseGuildEventDescription"
    | "parseAutoModerationSystemMessage"
    | "parseForumPostGuidelines"
    | "parseForumPostMostRecentMessage",
    (content: string, inline?: boolean, state?: Record<string, unknown>) => ReactNode[]
> &
    Record<
        "defaultRules" | "guildEventRules",
        Record<string, Record<"react" | "html" | "parse" | "match" | "order", unknown>>
    >;

export default (
    content: string,
    inline?: boolean,
    options?: Partial<{
        allowLinks: boolean;
        allowEmojiLinks: boolean;
        channelId?: string;
        mentionChannels: string[];
        isInteracting: boolean;
        formatInline: boolean;
        noStyleAndInteraction: boolean;
        allowHeading: boolean;
        allowList: boolean;
        previewLinkTarget: boolean;
        disableAnimatedEmoji: boolean;
        disableAutoBlockNewlines: boolean;
    }>
) => {
    if (!mdModule) mdModule = getModule(["parse", "defaultRules"]);

    if (!mdModule) {
        logger.warn("Aero failed to load the markdown module. This may cause unintended behavior.");

        return content;
    }

    return mdModule.parse(content, inline, options);
};
