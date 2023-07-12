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

import { CompilerOptions } from "typescript";
import logger from "~/common/logger";
import { hashDir, hashFile } from "~/renderer/util/hash";
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

const cachePath = "/data/.transpiled/plugins";
const hashableFiletypes = new Set(["js", "jsx", "ts", "tsx", "sass", "scss"]);
const ignoreDirs = new Set([".git", ".github", "node_modules", "assets"]);
const validPluginExtensions = new Set(["js", "jsx", "ts", "tsx"]);

function findValidIndex(path: string) {
    for (const ext of validPluginExtensions) {
        if (fs.exists(`${path}/index.${ext}`)) return `${path}/index.${ext}`;
    }

    return null;
}

const compilerOptions: CompilerOptions = {
    module: 1, // CommonJS
    target: 99, // ESNext
    jsx: 2, // React
    sourceMap: true,
    inlineSourceMap: true,
    jsxFactory: "window.aero.webpack.common.React.createElement",
    jsxFragmentFactory: "window.aero.webpack.common.React.Fragment",
}

function transpilePlugin(plugin, pluginName) {
    return window.aeroNative.external.transpile(plugin, pluginName, compilerOptions).outputText;
}

export const loadExternalPlugins = async () => {
    console.time("Plugins transpiled in");
    const plugins = [];

    const transpiledCache = new Map<string, {
        hash: string;
        transpiled: string;
    }>();
    fs.exists(cachePath) && fs.readdir(`${cachePath}`).forEach((file) => {
        const content = fs.readFile(`${cachePath}/${file}`);
        try {
            const parsed = JSON.parse(content);
            if (!parsed.hash || !parsed.transpiled) return;

            transpiledCache.set(file, parsed);
        } catch (e) {
            logger.error("Error trying to parse file:", e);
        }
    });

    for (const pluginName of fs.getFiles("/plugins")) {
        let pluginNameNoExt: string | string[] = pluginName.split(".");
        const ext = pluginNameNoExt.pop();
        pluginNameNoExt = pluginNameNoExt.join(".");

        if (!validPluginExtensions.has(ext) || pluginName.endsWith(".d.ts")) continue;

        const hash = await hashFile(`/plugins/${pluginName}`);
        if (transpiledCache.has(pluginNameNoExt)) {
            const cached = transpiledCache.get(pluginNameNoExt);

            if (cached.hash === hash) {
                logger.log("Using transpilation cache for", pluginNameNoExt);
                plugins.push(wrapJSLike(pluginName, cached.transpiled));
                transpiledCache.delete(pluginNameNoExt);
                continue;
            }
        }

        logger.debug("No transpilation cache or bad hash for", pluginNameNoExt);
        const transpiled = transpilePlugin(fs.readFile(`/plugins/${pluginName}`), pluginName);
        fs.writeFile(`${cachePath}/${pluginNameNoExt}`, JSON.stringify({
            hash,
            transpiled,
        }));
        plugins.push(wrapJSLike(pluginName, transpiled));
        transpiledCache.delete(pluginNameNoExt);
    }

    for (const pluginName of fs.subdirs("/plugins")) {
        const entrypoint = findValidIndex(`/plugins/${pluginName}`);
        if (!entrypoint) continue;

        const hash = await hashDir(`/plugins/${pluginName}`, ignoreDirs, (name) => hashableFiletypes.has(name.split(".").pop()) || name === "package.json");

        window.aeroNative.external.transpileProgram(`/plugins/${pluginName}`, entrypoint.split("/").pop(), compilerOptions);

    }

    // remove caches for plugins that no longer exist
    for (const pluginName of transpiledCache.keys()) {
        fs.unlinkFile(`${cachePath}/${pluginName}`);
    }

    console.timeEnd("Plugins transpiled in");
    return plugins;
};
