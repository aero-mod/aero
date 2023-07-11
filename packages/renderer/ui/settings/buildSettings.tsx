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

import { AeroPlugin } from "~/renderer/api/plugins/types";
import { pluginSettings } from "~/renderer/api/plugins";
import { React } from "~/renderer/api/webpack/common";
import { SettingsItem } from "../components";

const Item = (props: { setting: AeroPlugin["settings"][number]; settings: ProxyHandler<Record<string, unknown>> }) => {
    const type = props.setting.type === "boolean" ? "switch" : "input";

    const [value, setValue] = React.useState(
        props.settings[props.setting.id] || props.setting.initialValue || undefined
    );

    return (
        <SettingsItem
            type={type}
            title={props.setting.name}
            note={props.setting.description}
            value={value}
            onChange={(val) => {
                props.settings[props.setting.id] = val;

                setValue(val);
            }}
        />
    );
};

export default (plugin: AeroPlugin) => {
    const settings = pluginSettings(plugin.id);

    return (
        <>
            {plugin.settings.map((s) => (
                <Item setting={s} settings={settings} />
            ))}
        </>
    );
};
