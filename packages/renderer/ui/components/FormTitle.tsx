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

import "./formtitle.scss";

export default (props: {
    className?: string;
    nomargin?: boolean;
    level: 1 | 2 | 3 | 4 | 5 | 6;
    children: string | number | boolean | React.JSX.Element | React.ReactFragment;
}) => {
    switch (props.level) {
        case 1:
            return (
                <h1
                    className={`form-title ${props.nomargin ? "nomargin" : ""} h${props.level} ${
                        props.className || ""
                    }`}
                >
                    {props.children}
                </h1>
            );
        case 2:
            return (
                <h2
                    className={`form-title ${props.nomargin ? "nomargin" : ""}  h${props.level} ${
                        props.className || ""
                    }`}
                >
                    {props.children}
                </h2>
            );
        case 3:
            return (
                <h3
                    className={`form-title ${props.nomargin ? "nomargin" : ""}  h${props.level} ${
                        props.className || ""
                    }`}
                >
                    {props.children}
                </h3>
            );
        case 4:
            return (
                <h4
                    className={`form-title ${props.nomargin ? "nomargin" : ""}  h${props.level} ${
                        props.className || ""
                    }`}
                >
                    {props.children}
                </h4>
            );
        case 5:
            return (
                <h5
                    className={`form-title ${props.nomargin ? "nomargin" : ""}  h${props.level} ${
                        props.className || ""
                    }`}
                >
                    {props.children}
                </h5>
            );
        case 6:
            return (
                <h6
                    className={`form-title ${props.nomargin ? "nomargin" : ""}  h${props.level} ${
                        props.className || ""
                    }`}
                >
                    {props.children}
                </h6>
            );
    }
};
