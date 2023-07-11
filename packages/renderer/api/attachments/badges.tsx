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

import type React from "react";

import "./badges.scss";

export type PartialUser = {
    bot: boolean;
    id: string;
    username: string;
    globalName?: string;
    discriminator: string;
};

export type ProfileBadge = {
    predicate?: (user: PartialUser) => boolean;
    tooltipText?: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, user: PartialUser) => void;
    /**
     * Component to render on the user's profile.
     */
    component?: (props: { user: PartialUser }) => React.JSX.Element;
    /**
     * URL to the image to render on the user's profile.
     */
    url?: string;
};

const badges = new Set<ProfileBadge>();

export const addProfileBadge = (badge: ProfileBadge) => {
    badges.add(badge);
};

export const removeProfileBadge = (badge: ProfileBadge) => {
    badges.delete(badge);
};

export const _getProfileBadges = (user: PartialUser) => {
    return Array.from(badges).filter((badge) => {
        if (badge.predicate) {
            return badge.predicate(user);
        }

        return true;
    });
};
