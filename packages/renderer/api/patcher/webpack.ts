/* eslint-disable header/header */

/**
 * Modified from Vencord, a modification for Discord's desktop app (https://github.com/Vendicated/Vencord/blob/main/src/webpack/patchWebpack.ts)
 * Copyright (c) 2022 Vendicated and contributors
 *
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

import { chunkName, initialiseWebpack } from "../webpack";
import { patches, plugins } from "../plugins";
import logger from "~/common/logger";

let webpackChunk: unknown[];

if (window[chunkName]) {
    initialiseWebpack(window[chunkName]);
    patchPush();
} else {
    Object.defineProperty(window, chunkName, {
        get: () => webpackChunk,
        set: (v) => {
            if (v?.push !== Array.prototype.push) {
                initialiseWebpack(v);
                patchPush();

                delete window[chunkName];
                window[chunkName] = v;
            }
            webpackChunk = v;
        },
        configurable: true,
        enumerable: true,
    });
}

function patchPush() {
    const handlePush = (chunk: unknown) => {
        try {
            const modules = chunk[1];

            for (const id in modules) {
                let mod = modules[id];

                let code: string = mod.toString().replaceAll("\n", "");

                if (code.startsWith("function(")) {
                    code = "0," + code;
                }

                const originalMod = mod;
                const patchedBy = new Set();

                const factory = (modules[id] = function (
                    module: { exports: Window & typeof globalThis },
                    exports: unknown,
                    require: { c: { [x: string]: unknown } }
                ) {
                    try {
                        mod(module, exports, require);
                    } catch (err) {
                        if (mod === originalMod) throw err;

                        logger.error("Error in patched chunk", err);
                        return void originalMod(module, exports, require);
                    }

                    if (module.exports === window) {
                        Object.defineProperty(require.c, id, {
                            value: require.c[id],
                            enumerable: false,
                            configurable: true,
                            writable: true,
                        });

                        return;
                    }
                } as unknown as { toString: () => string; original: unknown; (...args: unknown[]): void });

                try {
                    factory.toString = () => mod.toString();
                    factory.original = originalMod;
                } catch {}

                for (let i = 0; i < patches.length; i++) {
                    const patch = patches[i];

                    const executePatch = (
                        match: string | RegExp,
                        replace: string | ((...args: string[]) => string)
                    ) => {
                        let replacment = replace;

                        const self = `window.aero.plugins[${JSON.stringify(patch.pluginID)}].self`;

                        if (typeof replace === "function") {
                            replacment = (...args) => replace(...args).replaceAll("$self", self);
                        } else {
                            replacment = replace.replaceAll("$self", self);
                        }

                        // @ts-expect-error the typings are just wrong here? string.replace accepts a function in chrome :/
                        return code.replace(match, replacment);
                    };

                    if (patch.predicate && !patch.predicate()) continue;

                    if (code.includes(patch.find)) {
                        patchedBy.add(patch.pluginID);

                        for (const replacement of patch.replacement) {
                            if (replacement.predicate && !replacement.predicate()) continue;

                            const lastMod = mod;
                            const lastCode = code;

                            try {
                                const newCode = executePatch(replacement.match, replacement.replace);

                                if (newCode === code && !patch.ignoreWarnings) {
                                    logger.warn(
                                        `Patch by ${patch.pluginID} had no effect (${id}): ${replacement.match}`
                                    );
                                } else {
                                    patch._active = true;

                                    Object.values(plugins)
                                        .find((p) => p.id === patch.pluginID)
                                        .patches.find((p) => p.find === patch.find)._active = true;

                                    code = newCode;

                                    mod = (0, eval)(
                                        `// Webpack Module ${id} - Patched by ${[...patchedBy].join(
                                            ", "
                                        )}\n${newCode}\n//# sourceURL=WebpackModule${id}`
                                    );
                                }
                            } catch (err) {
                                logger.error(
                                    `Patch by ${patch.pluginID} errored (Module id is ${id}): ${replacement.match}\n`,
                                    err
                                );

                                code = lastCode;
                                mod = lastMod;
                                patchedBy.delete(patch.pluginID);
                            }
                        }

                        if (!patch.all) patches.splice(i--, 1);
                    }
                }
            }
        } catch (err) {
            logger.error("Error in handlePush", err);
        }

        return handlePush.original.call(window[chunkName], chunk);
    };

    handlePush.original = window[chunkName].push;

    Object.defineProperty(window[chunkName], "push", {
        get: () => handlePush,
        set: (v) => (handlePush.original = v),
        configurable: true,
        enumerable: true,
    });
}
