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

import FormTitle from "./FormTitle";

import "./emptystate.scss";

export const WUMPUS_NOT_FOUND = {
    light: "/assets/b669713872b43ca42333264abf9c858e.svg",
    dark: "/assets/b669713872b43ca42333264abf9c858e.svg",
};

export const WUMPUS_GAMING = {
    light: "/assets/e0989b9d43cd9ca4417b49f4f8fbebc6.svg",
    dark: "/assets/e0989b9d43cd9ca4417b49f4f8fbebc6.svg",
};

type EmptyStateProps = {
    image: string;
    title: string;
    description: string;
};

export default (props: EmptyStateProps) => {
    return (
        <div className="empty-state">
            <img className="empty-state-image" src={props.image} alt="Wumpus" />
            <FormTitle level={1} className="empty-state-heading">
                {props.title}
            </FormTitle>
            <p className="empty-state-description">{props.description}</p>
        </div>
    );
};
