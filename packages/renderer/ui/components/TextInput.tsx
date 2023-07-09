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

import { React } from "~/renderer/api/webpack/common";

import "./textinput.scss";

type TextInputProps = {
    id?: string;
    type: string;
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    maxLength?: number;
    autoFocus?: boolean;
};

export default (props: TextInputProps) => {
    const [value, setValue] = React.useState(props.value);

    return (
        <div className="input-wrapper">
            <input
                id={props.id}
                className="input"
                placeholder={props.placeholder}
                maxLength={props.maxLength}
                type={props.type}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);

                    props.onChange(e.target.value);
                }}
            />
        </div>
    );
};
