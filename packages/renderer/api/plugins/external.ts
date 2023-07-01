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

import { originalConsole } from "~/renderer/util/polyfill";

const fs = window.aeroNative.fileSystem;

export const wrapJSLike = (filename: string, code: string) => {
    const fn = new Function(
        "require",
        "module",
        "exports",
        "console",
        `
${code}
    
if (typeof module.exports === "function") {
    return module.exports();
}

if (typeof module.exports === "object") {
    return module.exports;
}

return exports;

//# sourceURL=${filename}
`.trim()
    );

    const res = fn(window.require, {}, {}, originalConsole);

    return res?.default || res;
};

export const loadExternalPlugins = () => {
    const plugins = [];

    const pluginFiles = fs.readdir("/plugins");

    for (const plugin of pluginFiles) {
        const pluginPath = `/plugins/${plugin}`;

        if (fs.readFile(pluginPath)) {
            const plugin = fs.readFile(pluginPath);

            if (
                !pluginPath.endsWith(".ts") &&
                !pluginPath.endsWith(".tsx") &&
                !pluginPath.endsWith(".js") &&
                !pluginPath.endsWith(".jsx")
            )
                continue;

            if (!pluginPath.endsWith(".d.ts")) {
                const { outputText } = window.aeroNative.external.transpile(plugin, pluginPath.split("/").pop(), {
                    module: 1, // CommonJS
                    target: 99, // ESNext
                    jsx: 2, // React
                    sourceMap: true,
                    inlineSourceMap: true,
                    jsxFactory: "window.aero.webpack.common.React.createElement",
                    jsxFragmentFactory: "window.aero.webpack.common.React.Fragment",
                });

                plugins.push(wrapJSLike(pluginPath.split("/").pop(), outputText));
            }
        }
    }

    return plugins;
};
