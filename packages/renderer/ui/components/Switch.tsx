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

import "./switch.scss";

type SwitchProps = {
    value: boolean;
    onChange: (value: boolean) => void;
    className?: string;
    disabled?: boolean;
    id?: string;
};

export default (props: SwitchProps) => {
    const { value, onChange, className, disabled, id } = props;

    return (
        <div
            className={`switch-container ${className || ""} ${disabled ? "disabled" : ""}`}
            onClick={() => onChange(!value)}
            style={{
                backgroundColor: value ? "rgba(35, 165, 90, 1)" : "rgba(128, 132, 142, 1)",
            }}
        >
            <svg
                className="slider"
                viewBox="0 0 28 20"
                preserveAspectRatio="xMinYMid meet"
                aria-hidden="true"
                style={{ left: !value ? "-3px" : "12px" }}
            >
                <rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect>
                <svg viewBox="0 0 20 20" fill="none">
                    <path
                        fill={value ? "rgba(35, 165, 90, 1)" : "rgba(128, 132, 142, 1)"}
                        d={
                            value
                                ? "M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"
                                : "M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z"
                        }
                    ></path>
                    <path
                        fill={value ? "rgba(35, 165, 90, 1)" : "rgba(128, 132, 142, 1)"}
                        d={
                            value
                                ? "M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"
                                : "M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z"
                        }
                    ></path>
                </svg>
            </svg>
            <input
                id={id}
                type="checkbox"
                className="input"
                tabIndex={0}
                checked={value}
                onChange={() => {
                    // let it bubble
                }}
            />
        </div>
    );
};
