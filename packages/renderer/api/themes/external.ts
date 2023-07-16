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

import { wrapJSLike } from "../plugins/external";
import { scripts } from "../snippets";
import { Theme } from "./types";

const path = window.aeroNative.fileSystem.path;
const fs = window.aeroNative.fileSystem;

const possibleIndexes = (path: string) => {
    const indexes = [];

    for (const script of scripts) {
        indexes.push(`${path}/index.${script}`);
    }

    return indexes;
};

export const loadExternalThemes = () => {
    const themes = [];

    const themeFiles = fs.subdirs("/themes");

    for (const theme of themeFiles) {
        const themePath = `/themes/${theme}`;

        const indexes = possibleIndexes(themePath);

        for (const index of indexes) {
            if (!fs.exists(index)) continue;

            const content = fs.readFile(index);

            const { outputText } = window.aeroNative.external.transpile(content, index.split("/").pop(), {
                module: 1, // CommonJS
                target: 99, // ESNext
                jsx: 2, // React
                jsxFactory: "window.aero.webpack.common.React.createElement",
                jsxFragmentFactory: "window.aero.webpack.common.React.Fragment",
            });

            const theme = wrapJSLike(index, outputText);

            if (theme.entrypoint) {
                theme.entrypoint = path.join(themePath, theme.entrypoint);
            }

            if (theme) themes.push(theme);
        }
    }

    return themes;
};

export const loadCSS = (theme: Theme) => {
    const absolute = path.resolveToAbsolute(theme.entrypoint);

    const index = fs.readFile(theme.entrypoint);

    const { outputText, sourceMap } = window.aeroNative.external.transpileCSS(index, absolute);

    const codeWithSource =
        outputText +
        `\n\n/*# sourceURL=aero:theme */ \n/*# sourceMappingURL=data:application/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(sourceMap)
        )} */`;

    return codeWithSource;
};
