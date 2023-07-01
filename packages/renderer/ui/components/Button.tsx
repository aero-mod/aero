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

import "./button.scss";

export enum ButtonColor {
    BRAND = "brand",
    WHITE = "white",
    RED = "red",
    GREEN = "green",
    YELLOW = "yellow",
    LINK = "link",
    PRIMARY = "primary",
    TRANSPARENT = "transparent",
}

export enum ButtonSize {
    TINY = "tiny",
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
}

export enum ButtonLook {
    LINK = "link",
    OUTLINE = "outline",
    FILLED = "filled",
}

type ButtonProps = {
    children: string | number | boolean | React.JSX.Element | React.ReactFragment;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    color?: ButtonColor;
    size?: ButtonSize;
    look?: ButtonLook;
    fullwidth?: boolean;
};

export default (props: ButtonProps) => {
    const { children, onClick, disabled, className, style, color, size, look } = props;

    return (
        <button
            className={`button ${props.fullwidth ? "fullwidth" : ""} color-${color || ButtonColor.BRAND} size-${
                size || ButtonSize.SMALL
            } look-${look || ButtonLook.FILLED} ${className || ""}`}
            onClick={onClick}
            disabled={disabled}
            style={style}
        >
            <div className="contents">{children}</div>
        </button>
    );
};
