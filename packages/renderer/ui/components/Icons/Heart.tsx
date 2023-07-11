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
        ["M12 7.725C12.025-.722 23.022.577 23 9c-.017 6.875-11 13-11 13S1.08 15.875 1 9C.9.579 11.889-.722 12 7.725Z"],
        "0 0 24 24",
        props.size || 16,
        props.fill,
        props.stroke
    );
};
