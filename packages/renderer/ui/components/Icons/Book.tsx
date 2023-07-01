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

import { IconProps, makeSvg } from "./base";

export default (props: IconProps) => {
    return makeSvg(
        [
            "M 33 34.5833 V 7.5 H 35 V 36.6666 H 9 C 6.791 36.6666 5 34.801 5 32.5 V 7.5 C 5 5.1989 6.791 3.3333 9 3.3333 H 31 V 30.4166 H 9 C 7.8955 30.4166 7 31.3485 7 32.5 C 7 33.6515 7.8955 34.5833 9 34.5833 H 33",
        ],
        "0 0 40 40",
        props.size || 16,
        props.fill,
        props.stroke
    );
};
