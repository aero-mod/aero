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

import { Tooltip } from "~/renderer/api/webpack/common/components";
import { c } from "~/renderer/util/classes";

import "./panelbutton.scss";

type PanelButtonProps = {
    children: string | number | boolean | React.JSX.Element | React.ReactFragment;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    tooltipText: string;
};

export default (props: PanelButtonProps) => {
    return (
        <Tooltip text={props.tooltipText}>
            {(p) => (
                <button
                    {...p}
                    className={c("panel-button", props.className)}
                    onClick={props.onClick}
                    disabled={props.disabled}
                >
                    <div className="contents">{props.children}</div>
                </button>
            )}
        </Tooltip>
    );
};
