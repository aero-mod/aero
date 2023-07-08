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

import { sleep } from "../../util/time";
import logger from "~/common/logger";

import { WebpackInstance } from "discord-types/other";

export const chunkName = "webpackChunkdiscord_app";

export const globalPromise = new Promise(async (resolve) => {
    while (!window[chunkName]) await sleep(1);

    resolve(window[chunkName]);
});

export let __webpack_require__: WebpackInstance | undefined = undefined;
export let cache: WebpackInstance["c"];

export function initialiseWebpack(instance: typeof window.webpackChunkdiscord_app) {
    if (cache !== void 0) throw "no.";

    __webpack_require__ = instance.push([
        [Symbol("aero")],
        {},
        (r) => {
            r.d = (target, exports) => {
                for (const key in exports) {
                    if (!Reflect.has(exports, key) || target[key]) continue;

                    Object.defineProperty(target, key, {
                        get: () => exports[key](),
                        set: (v) => {
                            exports[key] = () => v;
                        },
                        enumerable: true,
                        configurable: true,
                    });
                }
            };

            return r;
        },
    ]);

    cache = __webpack_require__.c;

    instance.pop();
}

const mapped = [];

export const remapDefaults = () => {
    let c = 0;

    for (const ite in cache) {
        if (mapped.includes(ite)) continue;
        if (!Object.hasOwnProperty.call(cache, ite)) return;

        const ele = cache[ite].exports;

        if (!ele) continue;
        if (ele.default) continue;

        ["Z", "ZP"].forEach((key) => {
            if (ele[key]) {
                ele.default = ele[key];
                c++;
            }
        });

        mapped.push(ite);
    }

    logger.debug(`Remapped ${c} default exports`);
};

export const getModule = (
    filter: string[] | string | ((ele: unknown, id: number) => boolean | string),
    returnDefault = true,
    all = false
) => {
    let errorThrown = false;

    switch (typeof filter) {
        case "string":
            filter = Filters.byDisplayName(filter);
            break;
        case "object":
            if (Array.isArray(filter)) {
                filter = Filters.byKeys(...filter);
            }
            break;
    }

    const modules = [];

    for (const ite in cache) {
        if (!Object.hasOwnProperty.call(cache, ite)) return;

        const ele = cache[ite].exports;

        if (ele === window || ele?.[Symbol.toStringTag] === "DOMTokenList") continue;

        if (!ele) continue;

        if ((ele.Z || ele.ZP) && !ele.default) {
            remapDefaults();
        }

        try {
            const result = filter(ele, Number(ite));

            if (result) {
                if (typeof result === "string") {
                    modules.push(ele[result]);
                } else {
                    modules.push(ele);
                }
            }
        } catch (e) {
            errorThrown = e;
        }
    }

    if (errorThrown) logger.warn("Filter threw an error:", errorThrown);

    return all
        ? modules
        : returnDefault
        ? modules[0]?.default || modules[0]?.Z || modules[0]?.ZP || modules[0]
        : modules[0];
};

export const waitFor = async (
    filter: string[] | string | ((ele: unknown, id: number) => boolean | string),
    returnDefault = true,
    all = false
) => {
    while (!(() => __webpack_require__)) await sleep(1);

    while (!getModule(filter, returnDefault, all)) await sleep(1);

    return getModule(filter, returnDefault, all);
};

export const Filters = {
    byDisplayName: (name: string) => (ele: unknown) => ele["displayName"] === name,
    byStore: (name: string) => (ele: unknown) => ele["default"]?.constructor?.["displayName"] === name,
    byMangled: (filter: (ele: unknown) => boolean) => {
        return (mod: unknown) => {
            if (!mod) return false;

            if (typeof mod !== "object") return false;

            for (const ite of Object.keys(mod)) {
                if (!mod[ite]) continue;

                if (filter(mod[ite])) {
                    return ite;
                }
            }

            return false;
        };
    },
    byKeys:
        (...keys: string[]) =>
        (m: unknown) => {
            const topLevel = keys.every((prop) => typeof m[prop] !== "undefined");

            if (topLevel) return true;

            const _default = keys.every((prop) => {
                return (
                    typeof m["default"]?.[prop] !== "undefined" ||
                    typeof m["Z"]?.[prop] !== "undefined" ||
                    typeof m["ZP"]?.[prop] !== "undefined"
                );
            });

            if (_default) return true;

            return false;
        },
    byStrings:
        (...strings: string[]) =>
        (m: unknown) => {
            if (typeof m !== "object") return false;

            for (const key of Object.keys(m)) {
                if (!Object.hasOwnProperty.call(m, key)) continue;

                const ele = m[key];

                const string = (ele?.toString && ele?.toString?.()) || ele;

                if (typeof string !== "string") continue;

                if (strings.every((str) => string.includes(str))) return true;
            }

            return false;
        },
};
