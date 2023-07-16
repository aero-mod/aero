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

import { React } from "../webpack/common";

export interface Settings {
    debugLogs: boolean;
    loadThirdParty: boolean;
    themeURLS: string;
    vibrancy: boolean;
    enabledAddons: {
        themes: {
            [key: string]: boolean;
        };
        plugins: {
            [key: string]: boolean;
        };
    };
}

export default (): [() => Settings, (newSettings: Partial<Settings>) => void] => {
    const [_settings, setSettings] = React.useState<Settings>(window.aero.settings);

    return [
        () => _settings,
        (newSettings: Partial<Settings>) => {
            setSettings({ ..._settings, ...newSettings });

            for (const key in newSettings) {
                if (key === "_update") continue;

                window.aero.settings[key] = newSettings[key];
            }
        },
    ];
};
