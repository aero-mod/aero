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

import logger from "~/common/logger";

type Patch = {
    overWritten: boolean;
    type: string;
    module: { [x: PropertyKey]: () => unknown };
    method: PropertyKey;
    options: {
        callback: (...rest: unknown[]) => unknown;
    };
    id: string;
    revert: () => void;
    proxy: () => unknown;
    originalMethod: () => unknown;
};

export default class patcher {
    id = null;

    constructor(id: string) {
        this.id = id;
    }

    patches = [];

    _buildPatch(
        type: string,
        mod: { [x: PropertyKey]: () => unknown },
        method: PropertyKey,
        options: Patch["options"]
    ) {
        const patch: Patch = {
            overWritten: false,
            type,
            module: mod,
            method,
            options,
            id: this.id,
            revert: () => {
                this.unpatch(mod, method);
            },
            proxy: null,
            originalMethod: mod[method],
        };

        patch.proxy = this._buildProxy(patch);

        const descriptor = Object.getOwnPropertyDescriptor(mod, method);

        if (descriptor && descriptor.get) {
            patch.overWritten = true;
            try {
                Object.defineProperty(mod, method, {
                    configurable: true,
                    enumerable: true,
                    ...descriptor,
                    get: () => patch.proxy,
                    set: (value) => (patch.originalMethod = value),
                });
            } catch (e) {
                logger.error("Failed to overwrite getter", e);
            }
        } else {
            mod[method] = patch.proxy;
        }

        this.patches.push(patch);

        return patch;
    }

    _buildProxy(patch: Patch) {
        return function () {
            const { type, options, originalMethod } = patch;

            /* eslint-disable prefer-rest-params */
            let toReturn = originalMethod.apply(this, arguments);

            switch (type) {
                case "before":
                    try {
                        options.callback(arguments);
                    } catch (e) {
                        logger.error("Failed to call before patch", e);
                    }
                case "instead":
                    try {
                        toReturn = options.callback(arguments, originalMethod.bind(this));
                    } catch (e) {
                        logger.error("Failed to call instead patch", e);
                    }
                case "after":
                    try {
                        options.callback(arguments, toReturn);
                    } catch (e) {
                        logger.error("Failed to call after patch", e);
                    }
            }

            return toReturn;
        };
    }

    unpatch(mod: { [x: PropertyKey]: unknown }, method: PropertyKey) {
        const patch = this.patches.find((p) => p.module === mod && p.method === method);

        if (!patch) return;

        if (patch.overWritten) {
            Object.defineProperty(mod, method, {
                ...Object.getOwnPropertyDescriptor(mod, method),
                get: () => patch.originalMethod,
                set: undefined,
            });
        } else {
            mod[method] = patch.originalMethod;
        }

        this.patches.splice(this.patches.indexOf(patch), 1);
    }

    unpatchAll() {
        this.patches.forEach((patch) => {
            this.unpatch(patch.module, patch.method);
        });
    }

    before(
        mod: Patch["module"],
        method: PropertyKey,
        callback: Patch["options"]["callback"],
        options?: Patch["options"]
    ) {
        return this._buildPatch("before", mod, method, { ...options, callback });
    }

    instead(
        mod: Patch["module"],
        method: PropertyKey,
        callback: Patch["options"]["callback"],
        options?: Patch["options"]
    ) {
        return this._buildPatch("instead", mod, method, { ...options, callback });
    }

    after(
        mod: Patch["module"],
        method: PropertyKey,
        callback: Patch["options"]["callback"],
        options?: Patch["options"]
    ) {
        return this._buildPatch("after", mod, method, { ...options, callback });
    }
}
