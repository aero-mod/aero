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

import markdown from "../../util/markdown";

import TextInput from "./TextInput";
import Switch from "./Switch";

import "./settingsitem.scss";

type SettingsItemProps =
    | {
          type: "switch";
          title: string;
          note?: string;
          value: boolean;
          onChange: (value: boolean) => void;
      }
    | {
          type: "input";
          title: string;
          note?: string;
          value: string | number;
          onChange: (value: string | number) => void;
      };

export default (props: SettingsItemProps) => {
    const randomID = Math.random().toString(36).substring(2, 15);

    return (
        <div className="settings-item">
            <div className="settings-item-text">
                <label htmlFor={`aero-settings-item-input-${randomID}`} className="settings-item-title">
                    {props.title}
                </label>
                {props.note && <div className="settings-item-note">{markdown(props.note)}</div>}
            </div>
            <div className="settings-item-input">
                {props.type === "switch" ? (
                    <Switch id={`aero-settings-item-input-${randomID}`} value={props.value} onChange={props.onChange} />
                ) : props.type === "input" ? (
                    <TextInput
                        id={`aero-settings-item-input-${randomID}`}
                        type="text"
                        value={props.value}
                        onChange={(e) => props.onChange(e)}
                    />
                ) : null}
            </div>
        </div>
    );
};
